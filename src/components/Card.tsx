import React from 'react';

function OrderCard() {
  return (
    <div>
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm mx-auto" style={{ direction: 'rtl' }}>
        <div className="flex items-center mb-4">
          <img src="https://source.unsplash.com/50x50/?restaurant" alt="Restaurant Logo" className="rounded-full w-12 h-12 mr-3"/>
          <div>
            <h2 className="text-lg font-semibold">مطعم   </h2>
            <p className="text-gray-500 text-sm">٢٠٣٦ الجادة الثانية، نيويورك، نيويورك ١٠٠٢٩</p>
          </div>
        </div>

        <div className="space-y-4 mb-4">
          <div className="flex justify-between items-center">
            <span>دجاج تيكا سوب</span>
            <div className="flex items-center space-x-2">
              <button className="text-gray-500 border border-gray-300 px-2 py-1 rounded">-</button>
              <span>2</span>
              <button className="text-gray-500 border border-gray-300 px-2 py-1 rounded">+</button>
              <span className="font-semibold">$628</span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span>ميثي دجاج جاف</span>
            <div className="flex items-center space-x-2">
              <button className="text-gray-500 border border-gray-300 px-2 py-1 rounded">-</button>
              <span>2</span>
              <button className="text-gray-500 border border-gray-300 px-2 py-1 rounded">+</button>
              <span className="font-semibold">$628</span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span>كباب رشمي</span>
            <div className="flex items-center space-x-2">
              <button className="text-gray-500 border border-gray-300 px-2 py-1 rounded">-</button>
              <span>2</span>
              <button className="text-gray-500 border border-gray-300 px-2 py-1 rounded">+</button>
              <span className="font-semibold">$628</span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span>ليمون بالجبن الجاف</span>
            <div className="flex items-center space-x-2">
              <button className="text-gray-500 border border-gray-300 px-2 py-1 rounded">-</button>
              <span>2</span>
              <button className="text-gray-500 border border-gray-300 px-2 py-1 rounded">+</button>
              <span className="font-semibold">$628</span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span>رارا بانير</span>
            <div className="flex items-center space-x-2">
              <button className="text-gray-500 border border-gray-300 px-2 py-1 rounded">-</button>
              <span>2</span>
              <button className="text-gray-500 border border-gray-300 px-2 py-1 rounded">+</button>
              <span className="font-semibold">$628</span>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex">
            <input type="text" placeholder="أدخل رمز الترويج" className="w-full p-2 border border-gray-300 rounded-l-md"/>
            <button className="bg-pink-500 text-white p-2 rounded-r-md">تطبيق</button>
          </div>
        </div>

        <div className="mb-4">
          <textarea placeholder="أي اقتراحات؟ سنقوم بتمريرها..." className="w-full p-2 border border-gray-300 rounded-md"></textarea>
        </div>

        <div className="text-sm space-y-2 mb-4">
          <div className="flex justify-between">
            <span>إجمالي العناصر</span>
            <span>$3140</span>
          </div>
          <div className="flex justify-between">
            <span>رسوم المطعم</span>
            <span>$62.8</span>
          </div>
          <div className="flex justify-between">
            <span>رسوم التوصيل</span>
            <span>$10</span>
          </div>
          <div className="flex justify-between text-green-500">
            <span>إجمالي الخصم</span>
            <span>-$1884</span>
          </div>
        </div>

        <div className="flex justify-between items-center mb-4 font-semibold">
          <span className="text-lg">المبلغ المستحق</span>
          <span className="text-xl">$1329</span>
        </div>

        <button className="bg-green-500 text-white w-full py-3 rounded-lg text-lg font-semibold">
          ادفع $1329
        </button>
      </div>
    </div>
  );
}

export default OrderCard;