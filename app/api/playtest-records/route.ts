import { NextResponse } from "next/server";
import { mkdir, readFile, appendFile } from "fs/promises";
import path from "path";

const dataDirectory = path.join(process.cwd(), "data");
const recordFile = path.join(dataDirectory, "playtest-records.jsonl");

export async function POST(request: Request) {
  try {
    const snapshot = await request.json();

    const record = {
      id: crypto.randomUUID(),
      receivedAt: new Date().toISOString(),
      snapshot,
    };

    await mkdir(dataDirectory, { recursive: true });
    await appendFile(recordFile, `${JSON.stringify(record)}\n`, "utf8");

    return NextResponse.json({
      ok: true,
      id: record.id,
      receivedAt: record.receivedAt,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Unknown backend error",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const raw = await readFile(recordFile, "utf8");
    const records = raw
      .split("\n")
      .filter(Boolean)
      .map((line) => JSON.parse(line))
      .slice(-50)
      .reverse();

    return NextResponse.json({
      ok: true,
      records,
    });
  } catch {
    return NextResponse.json({
      ok: true,
      records: [],
    });
  }
}
