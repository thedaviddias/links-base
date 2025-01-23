import { type InferSettingsSchema } from '@/features/settings/schemas/settings.schema'

export const mockValidSettings: InferSettingsSchema = {
  general: {
    name: 'Links Base',
    description: '',
    bannerText: ''
  },
  links: {
    appearance: {
      defaultBrandColor: '#000000'
    }
  },
  environments: {
    configuration: {
      order: ['integration', 'staging', 'production'],
      enabled: ['integration', 'production', 'staging']
    },
    display: {
      labels: {
        integration: 'Integration',
        staging: 'Staging',
        production: 'Production'
      },
      colors: {
        integration: '#3b82f6',
        production: '#22c55e',
        staging: '#ea5638'
      }
    }
  },
  requests: {
    email: {
      enabled: true,
      address: 'links@company.com',
      subject: 'New Link Request',
      template:
        'From: %requester_name% <%requester_email%>\n\nLink Details:\nName: %name%\nURL: %url%\nCategory: %category%\nDescription: %description%'
    },
    github: {
      enabled: true,
      owner: 'thedaviddias',
      repo: 'link-base',
      labels: ['link-request'],
      template:
        '### Link Request\n\n**Name:** %name%\n**URL:** %url%\n**Category:** %category%\n\n**Description:**\n%description%'
    }
  },
  help: {
    links: {
      enabled: true
    },
    featureRequests: {
      enabled: true
    }
  },
  services: {
    imageProxy: {
      enabled: true,
      primary: 'https://api.allorigins.win/raw',
      fallback: 'https://cors-anywhere.herokuapp.com'
    }
  }
}

export const mockInvalidSettings = {
  general: {
    name: 123
  }
}
