import React from 'react'
interface infoItemProps {
    name:string;
    value:number;
    InfoIcon:React.FC<React.SVGProps<SVGSVGElement>>;
}
function InfoItem({name,value,InfoIcon}:infoItemProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-sm font-medium text-gray-600">{name}</h1>
        <p className="mt-1 text-2xl font-semibold text-gray-900">{value}</p>
      </div>
      <div className="bg-indigo-50 p-3 rounded-full">
        <InfoIcon className="h-6 w-6 text-indigo-600" />
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