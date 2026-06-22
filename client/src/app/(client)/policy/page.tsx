import ClientLayoutWrapper from '@/components/client/layout/client-layout-wrapper'
import PolicyIndex from '@/components/client/user/account/desktop/policy/policy-index'

export default function Policy() {
  return (
    <ClientLayoutWrapper hideCommit hideHero>
      <PolicyIndex />
    </ClientLayoutWrapper>
  )
}
