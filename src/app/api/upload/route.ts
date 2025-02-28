import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import * as fs from "fs";
import * as path from "path";
import csvParser from "csv-parser";
import * as XLSX from "xlsx";
import { Readable } from "stream";
import { v4 as uuidv4 } from "uuid";

// Helper function to ensure upload directory exists
function ensureUploadDir() {
  const uploadDir = process.env.UPLOAD_DIR || "./uploads";
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  return uploadDir;
}

// Helper function to parse CSV data
async function parseCSV(filePath: string): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const results: any[] = [];
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on("data", (data: any) => results.push(data))
      .on("end", () => resolve(results))
      .on("error", (error: Error) => reject(error));
  });
}

// Helper function to parse Excel data
function parseExcel(filePath: string): any[] {
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  return XLSX.utils.sheet_to_json(worksheet);
}

// Helper function to parse JSON data
function parseJSON(filePath: string): any[] {
  const fileContent = fs.readFileSync(filePath, "utf8");
  return JSON.parse(fileContent);
}

// Define schema field type
interface SchemaField {
  type: string;
  isDate?: boolean;
  isCarrier?: boolean;
  isDispatcher?: boolean;
}

// Helper function to detect check-in data structure and extract key fields
function processCheckInData(data: any[]): {
  processedData: any[];
  schema: Record<string, SchemaField>;
} {
  if (!data || data.length === 0) {
    return { processedData: [], schema: {} };
  }

  // Extract all possible field names from the data
  const allFields = new Set<string>();
  data.forEach((item) => {
    Object.keys(item).forEach((key) => allFields.add(key));
  });

  // Create a schema based on the fields
  const schema: Record<string, SchemaField> = {};

  allFields.forEach((field) => {
    // Try to determine field types and special fields
    const fieldLower = field.toLowerCase();

    // Check for date fields
    if (
      fieldLower.includes("date") ||
      fieldLower.includes("time") ||
      fieldLower.includes("day")
    ) {
      schema[field] = { type: "date", isDate: true };
    }
    // Check for carrier fields
    else if (
      fieldLower.includes("carrier") ||
      fieldLower.includes("service") ||
      fieldLower === "fmxh" ||
      fieldLower === "svld" ||
      fieldLower === "siet" ||
      fieldLower === "fseo" ||
      fieldLower === "tsvo" ||
      fieldLower === "aibl" ||
      fieldLower === "noed" ||
      fieldLower === "gmrl"
    ) {
      schema[field] = { type: "string", isCarrier: true };
    }
    // Check for dispatcher fields
    else if (
      fieldLower.includes("dispatcher") ||
      fieldLower.includes("employee") ||
      fieldLower.includes("staff") ||
      fieldLower.includes("worker")
    ) {
      schema[field] = { type: "string", isDispatcher: true };
    }
    // Default to string for other fields
    else {
      schema[field] = { type: "string" };
    }
  });

  // Process the data to ensure consistent structure
  const processedData = data.map((item) => {
    const processedItem: Record<string, any> = {};

    // Process each field according to its type
    Object.entries(item).forEach(([key, value]) => {
      if (schema[key]?.isDate) {
        // Try to parse dates
        try {
          const date = new Date(value as string);
          processedItem[key] = isNaN(date.getTime())
            ? value
            : date.toISOString();
        } catch {
          processedItem[key] = value;
        }
      } else {
        processedItem[key] = value;
      }
    });

    return processedItem;
  });

  return { processedData, schema };
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email as string },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Ensure upload directory exists
    const uploadDir = ensureUploadDir();

    // Parse the multipart form data
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: "No files were uploaded" },
        { status: 400 }
      );
    }

    // Process each file
    const processedFiles = [];
    for (const file of files) {
      // Generate a unique filename
      const fileName = `${uuidv4()}-${file.name}`;
      const filePath = path.join(uploadDir, fileName);

      // Write the file to disk
      const buffer = Buffer.from(await file.arrayBuffer());
      fs.writeFileSync(filePath, buffer);

      // Parse the file based on its type
      let parsedData: any[] = [];
      if (file.name.endsWith(".csv")) {
        parsedData = await parseCSV(filePath);
      } else if (file.name.endsWith(".xlsx") || file.name.endsWith(".xls")) {
        parsedData = parseExcel(filePath);
      } else if (file.name.endsWith(".json")) {
        parsedData = parseJSON(filePath);
      }

      // Process the data to extract check-in information
      const { processedData, schema } = processCheckInData(parsedData);

      try {
        // Save the file information to the database
        const uploadedFile = await prisma.uploadedFile.create({
          data: {
            filename: fileName,
            originalName: file.name,
            mimeType: file.type,
            size: file.size,
            userId: user.id,
          },
        });

        // Create a dataset from the file
        const dataset = await prisma.dataset.create({
          data: {
            name: file.name.split(".")[0], // Use the file name without extension as the dataset name
            description: `Uploaded on ${new Date().toLocaleString()}`,
            data: processedData as any,
            schema: schema as any,
            fileId: uploadedFile.id,
          },
        });

        // Create data entries for each row in the dataset
        for (const item of processedData) {
          // Try to extract date, carrier, and dispatcher information
          let date = new Date();
          let carrier = null;
          let dispatcher = null;
          let hour = null;

          // Look for date fields in the schema
          for (const [field, fieldInfo] of Object.entries(schema)) {
            if (fieldInfo.isDate && item[field]) {
              try {
                const parsedDate = new Date(item[field]);
                if (!isNaN(parsedDate.getTime())) {
                  date = parsedDate;

                  // Try to extract hour if this is a datetime
                  if (parsedDate.getHours() !== 0) {
                    hour = parsedDate.getHours();
                  }
                }
              } catch {
                // Ignore parsing errors
              }
            } else if (fieldInfo.isCarrier && item[field]) {
              carrier = String(item[field]);
            } else if (fieldInfo.isDispatcher && item[field]) {
              dispatcher = String(item[field]);
            }
          }

          // Create the data entry
          await prisma.dataEntry.create({
            data: {
              date,
              carrier,
              dispatcher,
              hour,
              data: item as any,
              datasetId: dataset.id,
            },
          });
        }

        processedFiles.push({
          id: uploadedFile.id,
          name: file.name,
          datasetId: dataset.id,
        });
      } catch (err) {
        console.error("Database error:", err);
        return NextResponse.json(
          { error: "Failed to process file data" },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      message: "Files uploaded successfully",
      files: processedFiles,
      datasetId: processedFiles[0]?.datasetId, // Return the first dataset ID for simplicity
    });
  } catch (error) {
    console.error("Error uploading files:", error);
    return NextResponse.json(
      { error: "Failed to upload files" },
      { status: 500 }
    );
  }
}
