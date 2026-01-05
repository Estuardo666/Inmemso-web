import App from '@/App'
import { getProjects, getServices } from '@/src/lib/getPayloadContent'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const [services, projects] = await Promise.all([getServices(), getProjects()])

  return <App services={services} projects={projects} />
}
