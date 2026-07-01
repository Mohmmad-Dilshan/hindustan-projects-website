/**
 * Maps Lucide icon names (stored in DB) to Lucide React components.
 * Add more as needed when new services are created.
 */
import {
  Globe,
  TrendingUp,
  Lightbulb,
  Code2,
  Star,
  Monitor,
  Smartphone,
  ShieldCheck,
  BarChart3,
  Megaphone,
  Layers,
  Settings,
  HelpCircle,
} from 'lucide-react'

const ICON_MAP = {
  Globe,
  TrendingUp,
  Lightbulb,
  Code2,
  Star,
  Monitor,
  Smartphone,
  ShieldCheck,
  BarChart3,
  Megaphone,
  Layers,
  Settings,
}

/**
 * Returns the Lucide icon component for a given icon name string.
 * Falls back to HelpCircle if not found.
 */
export function getServiceIcon(iconName) {
  return ICON_MAP[iconName] || HelpCircle
}
