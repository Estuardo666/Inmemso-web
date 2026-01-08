import App from '@/App'
import { getProjects, getServices, getHome } from '@/src/lib/getPayloadContent'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const [services, projects, home] = await Promise.all([getServices(), getProjects(), getHome()])

  return <App services={services} projects={projects} home={home} />
}
