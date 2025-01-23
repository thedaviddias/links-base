import { SidebarTrigger } from '@links-base/ui/sidebar'

export const AdminHeader = () => {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-4">
      <div className="flex items-center">
        <SidebarTrigger className="mr-4" />
      </div>
    </header>
  )
}
