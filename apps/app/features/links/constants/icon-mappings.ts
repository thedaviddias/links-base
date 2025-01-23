// Business Categories
export const CATEGORY_ICON_MAPPINGS = {
  // Core Business Functions
  sales: [
    'DollarSign',
    'TrendingUp',
    'ShoppingCart',
    'Receipt',
    'BadgePercent',
    'Store'
  ],
  marketing: [
    'Target',
    'Megaphone',
    'TrendingUp',
    'BarChart2',
    'Share2',
    'Presentation'
  ],
  finance: [
    'Wallet',
    'DollarSign',
    'Receipt',
    'CreditCard',
    'Calculator',
    'Landmark'
  ],
  hr: [
    'Users',
    'UserPlus',
    'Briefcase',
    'GraduationCap',
    'ClipboardList',
    'Building'
  ],
  legal: ['Scale', 'Shield', 'FileText', 'Gavel', 'Stamp', 'FileSignature'],
  operations: ['Settings2', 'Tool', 'Cog', 'Workflow', 'Factory', 'Building2'],

  // Technology & Development
  development: ['Code', 'Terminal', 'Git', 'Github', 'Brackets', 'Container'],
  infrastructure: [
    'Server',
    'Database',
    'HardDrive',
    'Network',
    'Cloud',
    'Container'
  ],
  security: [
    'Shield',
    'Lock',
    'Key',
    'Fingerprint',
    'ShieldCheck',
    'ShieldAlert'
  ],
  data: [
    'Database',
    'BarChart',
    'PieChart',
    'LineChart',
    'TrendingUp',
    'FileJson'
  ],
  testing: [
    'TestTube',
    'Bug',
    'Microscope',
    'Flask',
    'CheckCircle',
    'AlertTriangle'
  ],
  monitoring: ['Activity', 'LineChart', 'Bell', 'Gauge', 'Radio', 'Wifi'],

  // Communication & Collaboration
  communication: [
    'MessageSquare',
    'Mail',
    'Phone',
    'Video',
    'Headphones',
    'AtSign'
  ],
  meetings: [
    'Users',
    'Video',
    'Calendar',
    'Clock',
    'PresentationScreen',
    'Group'
  ],
  documents: [
    'FileText',
    'Files',
    'Book',
    'Clipboard',
    'ScrollText',
    'Archive'
  ],
  projects: [
    'Kanban',
    'ClipboardList',
    'Target',
    'Flag',
    'Milestone',
    'Calendar'
  ],
  resources: ['Database', 'FolderOpen', 'Library', 'Archive', 'Box', 'Package'],
  knowledge: [
    'BookOpen',
    'GraduationCap',
    'Library',
    'Brain',
    'LightBulb',
    'School'
  ],

  // Digital & Design
  design: ['Palette', 'Brush', 'PenTool', 'Image', 'Figma', 'Layers'],
  media: ['Image', 'Video', 'Film', 'Camera', 'Music', 'PlayCircle'],
  social: ['Share2', 'MessageCircle', 'Users', 'Heart', 'ThumbsUp', 'AtSign'],
  content: ['FileText', 'Edit3', 'Type', 'PenTool', 'Quote', 'Newspaper'],
  analytics: [
    'BarChart',
    'PieChart',
    'TrendingUp',
    'Activity',
    'LineChart',
    'Graph'
  ],
  advertising: [
    'Target',
    'Megaphone',
    'TrendingUp',
    'Eye',
    'Flag',
    'Presentation'
  ],

  // Support & Service
  support: [
    'Headphones',
    'MessageCircle',
    'HelpCircle',
    'LifeBuoy',
    'Phone',
    'Users'
  ],
  customer: [
    'Users',
    'Heart',
    'MessageSquare',
    'Star',
    'UserCheck',
    'HandShake'
  ],
  service: ['Bell', 'Clock', 'CheckCircle', 'Tool', 'Shield', 'Award'],
  feedback: [
    'MessageCircle',
    'ThumbsUp',
    'Star',
    'Smile',
    'ClipboardList',
    'Edit3'
  ],
  training: [
    'GraduationCap',
    'BookOpen',
    'Video',
    'Presentation',
    'Users',
    'School'
  ],
  help: [
    'HelpCircle',
    'BookOpen',
    'MessageCircle',
    'LifeBuoy',
    'Info',
    'FileQuestion'
  ],

  // Administration & Management
  admin: ['Settings', 'Users', 'Shield', 'Key', 'Lock', 'Sliders'],
  management: [
    'Briefcase',
    'Users',
    'Target',
    'TrendingUp',
    'ClipboardList',
    'Award'
  ],
  planning: ['Calendar', 'Clock', 'Target', 'Map', 'Compass', 'Route'],
  reporting: [
    'FileText',
    'BarChart',
    'PieChart',
    'Presentation',
    'ClipboardList',
    'FileChart'
  ],
  compliance: [
    'Shield',
    'CheckSquare',
    'FileCheck',
    'Scale',
    'Award',
    'Certificate'
  ],
  policies: [
    'FileText',
    'Shield',
    'Book',
    'ScrollText',
    'CheckSquare',
    'FileCheck'
  ],

  // Product & Service Delivery
  product: ['Box', 'Package', 'Truck', 'ShoppingBag', 'Tag', 'Barcode'],
  inventory: [
    'Package',
    'Boxes',
    'ClipboardList',
    'Truck',
    'BarChart2',
    'Warehouse'
  ],
  logistics: ['Truck', 'Package', 'Map', 'Globe', 'Navigation', 'Route'],
  quality: ['CheckCircle', 'Shield', 'Award', 'Star', 'Certificate', 'Medal'],
  maintenance: [
    'Tool',
    'Wrench',
    'Settings2',
    'HardHat',
    'Hammer',
    'Screwdriver'
  ],
  scheduling: [
    'Calendar',
    'Clock',
    'AlarmClock',
    'Watch',
    'Timer',
    'CalendarDays'
  ]
} as const

// Search Terms
export const SEARCH_TERM_ICON_MAPPINGS = {
  // Business Functions
  business: ['Briefcase', 'Building', 'TrendingUp', 'PieChart', 'DollarSign'],
  corporate: ['Building', 'Briefcase', 'Users', 'Target', 'Chart'],
  enterprise: ['Building2', 'Network', 'Globe', 'Users', 'Shield'],
  startup: ['Rocket', 'LightBulb', 'TrendingUp', 'Target', 'Users'],

  // Management & Leadership
  executive: ['Briefcase', 'Users', 'Target', 'Crown', 'Star'],
  leadership: ['Users', 'Target', 'Flag', 'Award', 'Trophy'],
  strategy: ['Target', 'Chess', 'Route', 'Map', 'Compass'],
  goals: ['Target', 'Flag', 'Trophy', 'Star', 'Award'],

  // Organizational
  department: ['Users', 'Folder', 'Building', 'Grid', 'Layout'],
  team: ['Users', 'UserPlus', 'Group', 'Heart', 'Flag'],
  organization: ['Building', 'Users', 'Network', 'Workflow', 'Sitemap'],
  division: ['Grid', 'Layout', 'SplitSquare', 'Users', 'Folder'],

  // Common Business Terms
  report: ['FileText', 'BarChart', 'PieChart', 'ClipboardList', 'Presentation'],
  metric: ['BarChart', 'TrendingUp', 'LineChart', 'PieChart', 'Activity'],
  budget: ['DollarSign', 'Wallet', 'Calculator', 'Receipt', 'PieChart'],
  revenue: ['DollarSign', 'TrendingUp', 'LineChart', 'Wallet', 'CreditCard'],
  performance: ['TrendingUp', 'Activity', 'Chart', 'Target', 'Award'],

  // Technology & Systems
  platform: ['Layers', 'Grid', 'Box', 'Server', 'Monitor'],
  system: ['Settings2', 'Server', 'Database', 'Network', 'Cloud'],
  software: ['Code', 'Monitor', 'Window', 'Terminal', 'Layout'],
  hardware: ['Server', 'HardDrive', 'Cpu', 'Smartphone', 'Monitor'],
  network: ['Network', 'Globe', 'Wifi', 'Share2', 'Cloud'],

  // Documentation & Knowledge
  manual: ['Book', 'FileText', 'Scroll', 'BookOpen', 'Files'],
  guide: ['Map', 'Compass', 'BookOpen', 'FileText', 'HelpCircle'],
  documentation: ['FileText', 'Files', 'Book', 'Clipboard', 'ScrollText'],
  tutorial: ['Video', 'PlayCircle', 'BookOpen', 'GraduationCap', 'School'],
  reference: ['BookOpen', 'FileText', 'Link', 'Bookmark', 'Library'],

  // Workflow & Process
  workflow: ['GitBranch', 'Flow', 'ArrowRight', 'Activity', 'Route'],
  process: ['GitBranch', 'Flow', 'ArrowRight', 'Activity', 'Route'],
  automation: ['Cog', 'Settings2', 'Zap', 'Bot', 'Workflow'],
  integration: ['Link', 'Plug', 'Connection', 'GitMerge', 'Share2'],
  pipeline: ['GitBranch', 'Flow', 'ArrowRight', 'Activity', 'Route']
} as const
