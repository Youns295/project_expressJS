-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_PostId_fkey";

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_PostId_fkey" FOREIGN KEY ("PostId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
