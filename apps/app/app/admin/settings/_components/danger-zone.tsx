'use client'

import { useRouter } from 'next/navigation'

import { AlertCircle } from 'lucide-react'

import { useSettings } from '@/features/settings/hooks/use-settings'
import { useSetupStore } from '@/features/setup/stores/setupStore'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@links-base/ui/alert-dialog'
import { Button } from '@links-base/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@links-base/ui/card'

/**
 * Component for dangerous operations like data deletion
 */
export const DangerZone = () => {
  const router = useRouter()
  const { deleteSettings, isLoading } = useSettings()
  const { setStep } = useSetupStore()

  const handleDeleteData = async () => {
    await deleteSettings()
    setStep(0)
    router.push('/setup')
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-destructive">Danger Zone</CardTitle>
        <CardDescription>
          Actions here can lead to permanent data loss. Please proceed with
          caution.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-md border border-destructive p-4">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <h3 className="font-medium">Delete All Data</h3>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            This action will permanently delete all data files in the
            public/data directory. This cannot be undone.
          </p>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                className="mt-4"
                disabled={isLoading}
              >
                {isLoading ? 'Deleting...' : 'Delete All Data'}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete all
                  your data files and remove them from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteData}
                  className="bg-destructive hover:bg-destructive/90"
                  disabled={isLoading}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  )
}
