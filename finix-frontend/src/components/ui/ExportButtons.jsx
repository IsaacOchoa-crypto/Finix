import React, { useState } from 'react';
import { FileText, FileSpreadsheet, Download, Loader2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import { toast } from 'sonner';

/**
 * Componente de Botones para Exportar Reportes Financieros en PDF y Excel (RF-08)
 * @param {Object} props
 * @param {string} props.targetContainerId - ID del contenedor HTML a capturar para el PDF (por defecto 'dashboard-report')
 * @param {Array} props.transactions - Arreglo de transacciones del usuario
 * @param {Object} props.summary - Resumen financiero (saldo, ingresos, gastos)
 */
const ExportButtons = ({ 
  targetContainerId = 'dashboard-report', 
  transactions = [], 
  summary = { saldo: 0, ingresosMes: 0, gastosMes: 0 } 
}) => {
  const [exportingPdf, setExportingPdf] = useState(false);
  const [exportingExcel, setExportingExcel] = useState(false);

  // ==========================================
  // 1. EXPORTAR A PDF (jsPDF + html2canvas)
  // ==========================================
  const handleExportPDF = async () => {
    setExportingPdf(true);
    const toastId = toast.loading('Generando documento PDF...');

    try {
      const container = document.getElementById(targetContainerId);
      if (!container) {
        throw new Error(`No se encontró el contenedor de reporte con id "${targetContainerId}".`);
      }

      // Capturar la pantalla del dashboard con html2canvas
      const canvas = await html2canvas(container, {
        scale: 2, // Mayor calidad gráfica
        useCORS: true,
        backgroundColor: '#0f172a',
        logging: false
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const imgWidth = 210; // Ancho A4 en mm
      const pageHeight = 297; // Alto A4 en mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      // Agregar primera página
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Paginación si el contenido excede 1 página
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const fecha = new Date().toISOString().split('T')[0];
      pdf.save(`Finix_Reporte_Financiero_${fecha}.pdf`);
      
      toast.success('¡Reporte PDF descargado con éxito!', { id: toastId });
    } catch (error) {
      console.error('Error al exportar PDF:', error);
      toast.error(`Error al generar PDF: ${error.message}`, { id: toastId });
    } finally {
      setExportingPdf(false);
    }
  };

  // ==========================================
  // 2. EXPORTAR A EXCEL (xlsx - SheetJS)
  // ==========================================
  const handleExportExcel = async () => {
    setExportingExcel(true);
    const toastId = toast.loading('Generando archivo Excel...');

    try {
      // Hoja 1: Resumen General
      const resumenData = [
        { Concepto: 'Saldo Total Actual', Monto: summary.saldo },
        { Concepto: 'Ingresos del Mes', Monto: summary.ingresosMes },
        { Concepto: 'Gastos del Mes', Monto: summary.gastosMes },
        { Concepto: 'Balance Neto Mensual', Monto: summary.ingresosMes - summary.gastosMes }
      ];

      // Hoja 2: Transacciones Detalladas
      const transaccionesTabla = transactions.map((t, index) => ({
        '#': index + 1,
        Fecha: t.fechaFormatted || (t.fecha ? String(t.fecha).split('T')[0] : 'N/A'),
        Tipo: (t.tipo || 'gasto').toUpperCase(),
        Categoría: t.categoria_nombre || t.categoria?.nombre || 'General',
        Monto: Number(t.monto) || 0,
        Nota: t.nota || '-'
      }));

      // Crear Libro de Excel
      const workbook = XLSX.utils.book_new();

      const hojaResumen = XLSX.utils.json_to_sheet(resumenData);
      const hojaTransacciones = XLSX.utils.json_to_sheet(transaccionesTabla);

      // Ajustar anchos de columna automáticos
      hojaResumen['!cols'] = [{ wch: 25 }, { wch: 15 }];
      hojaTransacciones['!cols'] = [
        { wch: 5 },
        { wch: 15 },
        { wch: 12 },
        { wch: 20 },
        { wch: 15 },
        { wch: 30 }
      ];

      XLSX.utils.book_append_sheet(workbook, hojaResumen, 'Resumen Financiero');
      XLSX.utils.book_append_sheet(workbook, hojaTransacciones, 'Historial de Movimientos');

      const fecha = new Date().toISOString().split('T')[0];
      XLSX.writeFile(workbook, `Finix_Reporte_Financiero_${fecha}.xlsx`);

      toast.success('¡Archivo Excel (.xlsx) descargado con éxito!', { id: toastId });
    } catch (error) {
      console.error('Error al exportar Excel:', error);
      toast.error(`Error al generar Excel: ${error.message}`, { id: toastId });
    } finally {
      setExportingExcel(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      {/* Botón Exportar PDF */}
      <button
        onClick={handleExportPDF}
        disabled={exportingPdf}
        className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-red-600/80 to-rose-600/80 hover:from-red-500 hover:to-rose-500 text-white rounded-xl font-semibold text-sm transition-all duration-200 shadow-lg shadow-red-500/20 hover:shadow-red-500/30 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed border border-red-500/30"
      >
        {exportingPdf ? (
          <Loader2 size={16} className="animate-spin text-white" />
        ) : (
          <FileText size={16} />
        )}
        <span>Descargar PDF</span>
      </button>

      {/* Botón Exportar Excel */}
      <button
        onClick={handleExportExcel}
        disabled={exportingExcel}
        className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-600/80 to-teal-600/80 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl font-semibold text-sm transition-all duration-200 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed border border-emerald-500/30"
      >
        {exportingExcel ? (
          <Loader2 size={16} className="animate-spin text-white" />
        ) : (
          <FileSpreadsheet size={16} />
        )}
        <span>Descargar Excel</span>
      </button>
    </div>
  );
};

export default ExportButtons;
