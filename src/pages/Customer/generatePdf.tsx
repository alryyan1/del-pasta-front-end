import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Customer } from '@/Types/types';
import font  from './../../fonts/Cairo-Regular.ttf'
export const generateCustomerReport = (customers: Customer[]) => {
  
  const doc = new jsPDF();
  doc.addFileToVFS('Cairo.ttf', font);
  doc.addFont('Cairo.ttf', 'Cairo-Regular', 'normal');
  // doc.addFileToVFS("Amiri-Regular-normal.ttf", myFontAmiri);
  // doc.addFont("MyFont.ttf", "MyFont", "normal");
  doc.setFontSize(20);
  doc.text('Customer Report', 14, 22);
  doc.setFontSize(10);
  doc.text(`Generated on ${new Date().toLocaleDateString()}`, 14, 30);

  const tableData = customers.map((customer) => [
    `${customer.firstName} ${customer.lastName}`,
    customer.email,
    customer.phone,
    customer.company,
    customer.address,
  ]);

  autoTable(doc, {
    head: [['Name', 'Email', 'Phone', 'Company', 'Address']],
    body: tableData,
    startY: 35,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [66, 66, 66] },
  });

  doc.save('customer-report.pdf');
};