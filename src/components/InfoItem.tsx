import { Typography } from '@mui/material';
import React from 'react'
interface infoItemProps {
    name:string;
    value:number;
    InfoIcon:React.FC<React.SVGProps<SVGSVGElement>>;
    moneyTxt:boolean
}
function InfoItem({name,value,InfoIcon,moneyTxt}:infoItemProps) {
  return (
    <div className="dashborad-stats p-6 rounded-lg shadow-lg">
    <div className="flex items-center justify-between">
      <div>
        <Typography variant='h5' className="font-medium text-gray-600">{name}</Typography>
        <p className="mt-1 text-2xl font-semibold text-gray-900">{value}</p>
      </div>
      <div className="bg-indigo-50 p-3 rounded-full">
       {moneyTxt ? 'OMR':  <InfoIcon className="h-6 w-6 text-indigo-600" />}
      </div>
    </div>
    <div className="mt-4">
      {/* <span className="text-sm font-medium text-green-600">0</span> */}
      {/* <span className="text-sm text-gray-500"> from last month</span> */}
    </div>
  </div>
  )
}

export default InfoItem