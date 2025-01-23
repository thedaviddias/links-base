import LinkForm from './form'

// Define allowed actions
const allowedActions = ['add', 'edit'] as const
type ActionType = (typeof allowedActions)[number]

// Required for static site generation
export function generateStaticParams() {
  return allowedActions.map(action => ({
    action
  }))
}

const isValidAction = (action: string): action is ActionType => {
  return allowedActions.includes(action as ActionType)
}

type LinkFormPageProps = {
  params: { action: string }
}

export default function LinkFormPage({ params }: LinkFormPageProps) {
  if (!isValidAction(params.action)) {
    // Instead of using redirect, we'll handle this client-side in the form component
    return null
  }

  return <LinkForm params={{ action: params.action }} />
}
