export interface ServiceItem {
  name: string;
  description: string;
  price?: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface HoursConfig {
  timezone: string;
  hours: Record<string, string>;
}

export interface LeadCaptureFields {
  name: boolean;
  email: boolean;
  phone: boolean;
  company: boolean;
  message: boolean;
}

export interface ClientConfig {
  clientId: string;
  businessName: string;
  industry: string;
  primaryColor: string;
  secondaryColor: string;
  greeting: string;
  systemPromptBase: string;
  services: ServiceItem[];
  faqs: FAQItem[];
  hours?: HoursConfig;
  leadCapture: LeadCaptureFields;
  notificationEmail: string;
  buyingIntentKeywords: string[];
  allowedDomains: string[];
}

const clients: Record<string, ClientConfig> = {
  opsos: {
    clientId: 'opsos',
    businessName: 'OpsOS',
    industry: 'Operations Software',
    primaryColor: '#6366f1',
    secondaryColor: '#4f46e5',
    greeting: 'Hi! I\'m the OpsOS assistant. How can I help you streamline your operations today?',
    systemPromptBase: `You are a helpful assistant for OpsOS, an operations management platform that helps businesses automate workflows, track KPIs, and manage their teams more effectively.

You help potential customers understand our platform's capabilities, answer questions about pricing and features, and guide them toward booking a demo or starting a free trial.

Key features of OpsOS:
- Automated workflow management
- Real-time KPI dashboards
- Team collaboration tools
- Integrations with 100+ business tools
- AI-powered insights and recommendations

Always be helpful, professional, and focused on understanding the customer's pain points and how OpsOS can solve them.`,
    services: [
      {
        name: 'OpsOS Starter',
        description: 'Perfect for small teams up to 10 users',
        price: '$49/month'
      },
      {
        name: 'OpsOS Professional',
        description: 'For growing businesses with up to 50 users',
        price: '$149/month'
      },
      {
        name: 'OpsOS Enterprise',
        description: 'Unlimited users with dedicated support',
        price: 'Custom pricing'
      }
    ],
    faqs: [
      {
        question: 'How long does setup take?',
        answer: 'Most teams are up and running within 24 hours. Our onboarding team provides guided setup assistance.'
      },
      {
        question: 'Do you offer a free trial?',
        answer: 'Yes! We offer a 14-day free trial with full access to all Professional features, no credit card required.'
      },
      {
        question: 'What integrations do you support?',
        answer: 'OpsOS integrates with Slack, Jira, Salesforce, HubSpot, Google Workspace, Microsoft 365, and 100+ other tools.'
      },
      {
        question: 'Is my data secure?',
        answer: 'Absolutely. OpsOS is SOC 2 Type II certified and GDPR compliant. Your data is encrypted at rest and in transit.'
      }
    ],
    hours: {
      timezone: 'America/New_York',
      hours: {
        monday: '9:00 AM - 6:00 PM',
        tuesday: '9:00 AM - 6:00 PM',
        wednesday: '9:00 AM - 6:00 PM',
        thursday: '9:00 AM - 6:00 PM',
        friday: '9:00 AM - 5:00 PM',
        saturday: 'Closed',
        sunday: 'Closed'
      }
    },
    leadCapture: {
      name: true,
      email: true,
      phone: false,
      company: true,
      message: true
    },
    notificationEmail: 'sales@opsos.io',
    buyingIntentKeywords: [
      'pricing', 'price', 'cost', 'how much', 'demo', 'trial', 'free trial',
      'sign up', 'get started', 'purchase', 'buy', 'subscribe', 'plan',
      'enterprise', 'quote', 'discount', 'sales'
    ],
    allowedDomains: ['opsos.io', 'www.opsos.io', 'localhost']
  },
  caliber_demo: {
    clientId: 'caliber_demo',
    businessName: 'Caliber Web Studio',
    industry: 'Web Design & Development Agency',
    primaryColor: '#0ea5e9',
    secondaryColor: '#0284c7',
    greeting: 'Hello! I\'m the Caliber Web Studio assistant. How can I help you with your web project today?',
    systemPromptBase: `You are a helpful assistant for Caliber Web Studio, a premium web design and development agency specializing in building high-performance websites and web applications for businesses.

You help potential clients understand our services, answer questions about our process and pricing, and guide them toward booking a free consultation call.

Our expertise includes:
- Custom website design and development
- E-commerce solutions (Shopify, WooCommerce, custom)
- Web application development
- SEO and performance optimization
- Ongoing website maintenance and support

Always be friendly, professional, and focus on understanding the client's business goals and how we can help them achieve them online.`,
    services: [
      {
        name: 'Starter Website',
        description: '5-page professional website with CMS',
        price: 'Starting at $2,500'
      },
      {
        name: 'Business Website',
        description: 'Custom design with up to 15 pages and advanced features',
        price: 'Starting at $5,000'
      },
      {
        name: 'E-commerce Store',
        description: 'Full-featured online store with payment processing',
        price: 'Starting at $7,500'
      },
      {
        name: 'Web Application',
        description: 'Custom web app development with ongoing support',
        price: 'Custom quote'
      }
    ],
    faqs: [
      {
        question: 'How long does a website project take?',
        answer: 'Typical websites take 4-8 weeks from kickoff to launch. Complex projects or e-commerce stores may take 8-12 weeks.'
      },
      {
        question: 'Do you offer website maintenance?',
        answer: 'Yes! We offer monthly maintenance packages starting at $150/month that include updates, backups, security monitoring, and support.'
      },
      {
        question: 'What platforms do you work with?',
        answer: 'We work with Next.js, WordPress, Webflow, Shopify, and custom solutions depending on your needs and goals.'
      },
      {
        question: 'Do you help with SEO?',
        answer: 'Yes, all our websites are built with SEO best practices. We also offer ongoing SEO services to help you rank higher in search results.'
      }
    ],
    leadCapture: {
      name: true,
      email: true,
      phone: true,
      company: true,
      message: true
    },
    notificationEmail: 'hello@caliberwebstudio.com',
    buyingIntentKeywords: [
      'pricing', 'price', 'cost', 'how much', 'quote', 'estimate',
      'hire', 'project', 'build', 'create', 'design', 'develop',
      'consultation', 'schedule', 'book', 'start', 'get started'
    ],
    allowedDomains: ['caliberwebstudio.com', 'www.caliberwebstudio.com', 'localhost']
  }
};

export function getClientConfig(clientId: string): ClientConfig | null {
  return clients[clientId] || null;
}

export function getAllClients(): ClientConfig[] {
  return Object.values(clients);
}

export function buildSystemPrompt(config: ClientConfig): string {
  let prompt = config.systemPromptBase;

  if (config.services.length > 0) {
    prompt += '\n\nOur Services:\n';
    config.services.forEach(service => {
      prompt += `- ${service.name}: ${service.description}`;
      if (service.price) prompt += ` (${service.price})`;
      prompt += '\n';
    });
  }

  if (config.faqs.length > 0) {
    prompt += '\n\nFrequently Asked Questions:\n';
    config.faqs.forEach(faq => {
      prompt += `Q: ${faq.question}\nA: ${faq.answer}\n\n`;
    });
  }

  if (config.hours) {
    prompt += `\nBusiness Hours (${config.hours.timezone}):\n`;
    Object.entries(config.hours.hours).forEach(([day, hours]) => {
      prompt += `- ${day.charAt(0).toUpperCase() + day.slice(1)}: ${hours}\n`;
    });
  }

  prompt += '\n\nIMPORTANT: If a user shows buying intent or asks about pricing, always try to capture their contact information so our team can follow up. Be helpful and conversational, not salesy.';

  return prompt;
}
