'use client'

import { PlusCircle } from 'lucide-react'

import { RequestLinkForm } from '@/features/request-link/components/request-link-form'
import { useSettings } from '@/features/settings/hooks/use-settings'

import { Button } from '@links-base/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@links-base/ui/dialog'
import { useSidebar } from '@links-base/ui/sidebar'

export function RequestLinkButton() {
  const { settings } = useSettings()
  const { state } = useSidebar()

  if (
    !settings?.requests?.email.enabled &&
    !settings?.requests?.github.enabled
  ) {
    return null
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="mx-2 gap-2">
          <PlusCircle className="h-4 w-4" />
          {state !== 'collapsed' && <span>Request Link</span>}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Request a New Link</DialogTitle>
          <DialogDescription>
            Submit a request to add a new link to the directory.
          </DialogDescription>
        </DialogHeader>
        <RequestLinkForm />
      </DialogContent>
    </Dialog>
  )
}
