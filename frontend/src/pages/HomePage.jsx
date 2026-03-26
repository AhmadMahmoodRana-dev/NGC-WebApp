import HeroSection       from '../components/home/HeroSection'
import StatsSection      from '../components/home/StatsSection'
import QuickAccess       from '../components/home/QuickAccess'
import NewsSection       from '../components/home/NewsSection'
import ProjectsSection   from '../components/home/ProjectsSection'
import PublicationsSection from '../components/home/PublicationsSection'
import StakeholderCTA    from '../components/home/StakeholderCTA'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <QuickAccess />
      <NewsSection />
      <ProjectsSection />
      <PublicationsSection />
      <StakeholderCTA />
    </>
  )
}
