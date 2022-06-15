import React, { useEffect, useContext, useState } from 'react'
import { FaChartArea } from 'react-icons/fa'
import { formatDate, toEther } from '../../lib/utils'
import { useParams } from 'react-router-dom'
import TokenContext from '../../store/token-context'
import DataTable from 'react-data-table-component'
import AOS from 'aos'

const columns = [
  {
    name: 'Time',
    selector: (row) => row.time,
    cell: (row) => {
      ;<div row={row}>
        <p className="mb-0">{formatDate(parseInt(row.time) * 1000)}</p>
      </div>
    },
  },
  {
    name: 'Action',
    selector: (row) => row.action,
    cell: (row) =>
      row.action === 'Mint' ? (
        <div row={row}>
          <span className="badge bg-primary">Mint Tokens</span>
        </div>
      ) : row.action === 'Request tokens' ? (
        <div row={row}>
          <span className="badge bg-success">Tokens Requested</span>
        </div>
      ) : row.action === 'Unapproved' ? (
        <div row={row}>
          <span className="badge bg-info"> Tokens Unapproved</span>
        </div>
      ) : row.action === 'Approved' ? (
        <div row={row}>
          <span className="badge bg-teal">Tokens Approved</span>
        </div>
      ) : row.action === 'Added to Whitelist' ? (
        <div row={row}>
          <span className="badge bg-teal">Added to Whitelist</span>
        </div>
      ) : row.action === 'Removed from Whitelist' ? (
        <div row={row}>
          <span className="badge bg-danger">Removed from Whitelist</span>
        </div>
      ) : (
        '-'
      ),
  },
  {
    name: 'Tokens Amount',
    selector: (row) => row.amount,
    cell: (row) => (
      <div row={row}>
        {row.amount > 0 ? (
          <p className="mb-0">{row.amount / 10 ** 18}</p>
        ) : (
          <p className="mb-0">-</p>
        )}
      </div>
    ),
  },
  {
    name: 'Token Price',
    selector: (row) => row.tokenPrice,
    cell: (row) => (
      <div row={row}>
        {row.tokenPrice > 0 ? (
          <p className="mb-0">{toEther(parseFloat(row.tokenPrice))} Ether</p>
        ) : (
          <p className="mb-0">-</p>
        )}
      </div>
    ),
  },
]

function UserTable() {
  const tokenCtx = useContext(TokenContext)
  const { address } = useParams()
  const [userTransactions, setUserTransactions] = useState([])

  useEffect(() => {
    if (tokenCtx.activity) {
      const activities = tokenctx.activity
        .filter((item) => item[0] === address)
        .map((item) => {
          return {
            account: item[0],
            amount: item[1],
            tokenPrice: item[2],
            time: item[3],
            periodIndex: item[4],
            action: item[5],
          }
        })

      setUserTransactions(activities)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenCtx.activity])

  console.log(userTransactions)

  return (
    <div className="card shadow-lg" data-aos="fade-up" data-aos-delay="200">
      <div className="card-body p-lg-5">
        <div className="d-flex align-items-center mb-5">
          <div className="stats-icon solid-cyan">
            <FaChartArea size="1.4rem" />
          </div>
          <div className="ms-3">
            <h2 className="mb-0 h4">Transaction History</h2>
            <p className="text-muted fw-normal mb-0"></p>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={userTransactions}
          pagination={userTransactions.length >= 1 && true}
          responsive
          theme="solarized"
        />
      </div>
    </div>
  )
}

export default UserTable
