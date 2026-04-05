/*
  Warnings:

  - You are about to drop the column `cpf` on the `convidado` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `Convidado` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `Convidado` table without a default value. This is not possible if the table is not empty.
  - Added the required column `telefone` to the `Convidado` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Convidado_cpf_key` ON `convidado`;

-- AlterTable
ALTER TABLE `convidado` DROP COLUMN `cpf`,
    ADD COLUMN `email` VARCHAR(191) NOT NULL,
    ADD COLUMN `telefone` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Convidado_email_key` ON `Convidado`(`email`);
