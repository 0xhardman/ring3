import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  try {
    const recipientAdd = req.query.recipientAdd;
    const ring3Record = await prisma.Ring3Record.findMany({
      where: {
        recipientAdd: recipientAdd,
      },
    });

    res.status(200).json(ring3Record);
  } catch (err) {
    console.log("from API error", err);
    res.status(400).json({ message: "Something went wrong" });
  }
}
