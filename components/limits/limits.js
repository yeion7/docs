import { useEffect, useState } from 'react'
import { API_LIMITS } from '../../lib/constants'
import { InlineCode } from '../text/code'
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableRowCell,
  TableHeadCell
} from '~/components/table'

function Limits() {
  const [limits, setLimits] = useState([])
  useEffect(() => {
    async function getLimits() {
      const res = await fetch(API_LIMITS)
      const data = await res.json()
      setLimits({ ...data })
      return null
    }
    getLimits()
  }, [])
  return limits && limits.rateLimits ? (
    <Table>
      <TableHead>
        <TableRow>
          <TableHeadCell className="head-cell">Description</TableHeadCell>
          <TableHeadCell className="head-cell">Limit</TableHeadCell>
          <TableHeadCell className="head-cell">
            Duration (Seconds)
          </TableHeadCell>
          <TableHeadCell className="head-cell">Scope</TableHeadCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {limits.rateLimits.map(l => (
          <TableRow key={l.description}>
            <TableRowCell>{l.description}</TableRowCell>
            <TableRowCell>{l.max}</TableRowCell>
            <TableRowCell>{l.duration / 1000}</TableRowCell>
            <TableRowCell>
              <InlineCode>{l.scope}</InlineCode>
            </TableRowCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ) : null
}

export default Limits
