'use client'

import { useTranslations } from 'next-intl'
import { BsPatchCheckFill } from 'react-icons/bs'
import { FaMoneyBillTransfer, FaTruckFast, FaTruckPlane } from 'react-icons/fa6'
import { GoPackageDependencies } from 'react-icons/go'
import { GiPriceTag } from 'react-icons/gi'

const commitments = [
  {
    icon: <BsPatchCheckFill className="h-5 w-5 text-primary" />,
    textKey: 'authentic'
  },
  {
    icon: <FaTruckFast className="h-5 w-5 text-primary" />,
    textKey: 'fastShipping'
  },
  {
    icon: <FaMoneyBillTransfer className="h-5 w-5 text-primary" />,
    textKey: 'refund'
  },
  {
    icon: <GoPackageDependencies className="h-5 w-5 text-primary" />,
    textKey: 'returns'
  },
  {
    icon: <GiPriceTag className="h-5 w-5 text-primary" />,
    textKey: 'bestPrice'
  },
  {
    icon: <FaTruckPlane className="h-5 w-5 text-primary" />,
    textKey: 'tracking'
  }
]

const DesktopCommit = () => {
  const t = useTranslations('client.header.commitments')

  return (
    <div className="border-b bg-gray-50">
      <div className="max-w-[1350px] mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-start h-12 gap-6">
          <span className="text-sm font-semibold text-primary">{t('title')}</span>
          <div className="flex flex-1 items-center justify-between cursor-pointer">
            {commitments.map((commit, index) => (
              <div key={commit.textKey} className="flex flex-1 items-center">
                <div className="flex flex-1 items-center justify-center gap-2">
                  {commit.icon}
                  <span className="font-medium text-[12px] text-black">{t(commit.textKey)}</span>
                </div>
                {index < commitments.length - 1 && <div className="h-5 w-px bg-gray-300" />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DesktopCommit
