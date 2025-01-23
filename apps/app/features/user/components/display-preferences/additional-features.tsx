'use client'

import { Label } from '@links-base/ui/label'
import { Switch } from '@links-base/ui/switch'

export type AdditionalFeaturesProps = {
  showFavorites: boolean
  onShowFavoritesChange: (checked: boolean) => void
}

export const AdditionalFeatures = ({
  showFavorites,
  onShowFavoritesChange
}: AdditionalFeaturesProps) => {
  return (
    <div className="space-y-4">
      <div className="text-sm font-medium">Additional Features</div>
      <div className="grid gap-4">
        <div className="grid grid-cols-3 items-center gap-4">
          <Label htmlFor="show-favorites">Show Favorites</Label>
          <div className="col-span-2">
            <Switch
              id="show-favorites"
              checked={showFavorites}
              onCheckedChange={onShowFavoritesChange}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
