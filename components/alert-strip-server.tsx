import { AlertStrip } from '@/components/alert-strip'
import {
  fetchTranslinkAlerts,
  isStartedWithinDays,
  isStillRelevant,
  scoreAlert,
} from '@/helpers/translinkAlertsHelper'

export async function AlertStripServer() {
  const all = await fetchTranslinkAlerts('all')
  const recent = all
    .filter((a) => isStartedWithinDays(a.startDate, 3) && isStillRelevant(a))
    .sort((a, b) => scoreAlert(b) - scoreAlert(a))
  if (recent.length === 0) return null
  return <AlertStrip alerts={recent} />
}
