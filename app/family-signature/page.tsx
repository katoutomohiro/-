import { FamilySignatureForm } from "@/components/family-signature-form"
import { DataStorageService } from "@/services/data-storage-service"

export default function FamilySignaturePage() {
  // Try to pick the first available user to satisfy FamilySignatureForm props
  const users = DataStorageService.getCustomUserNames()
  const firstUser = users && users.length > 0 ? users[0] : "利用者A"
  const userId = firstUser // repository uses userName as id in many places

  return (
    <div className="container mx-auto py-8">
      <FamilySignatureForm userId={userId} userName={firstUser} />
    </div>
  )
}
