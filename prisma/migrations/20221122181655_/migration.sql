-- CreateTable
CREATE TABLE "Ring3Record" (
    "gifterAdd" STRING NOT NULL,
    "recipientAdd" STRING NOT NULL,
    "gifterSig" STRING NOT NULL,
    "recipientSig" STRING NOT NULL,

    CONSTRAINT "Ring3Record_pkey" PRIMARY KEY ("gifterAdd")
);
