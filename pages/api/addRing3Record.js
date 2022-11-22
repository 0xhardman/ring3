import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const data = req.body; //JSON.parse(req.body);
    const ring3Record = await prisma.Ring3Record.create({
      data: data,
    });

    res.status(200).json(ring3Record);
  } catch (err) {
    console.log("from API error", err);
    res.status(400).json({ message: "Something went wrong" });
  }
}
