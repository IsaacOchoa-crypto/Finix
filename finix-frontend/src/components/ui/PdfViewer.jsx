import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
// Prefer using the bundled worker to avoid CDN/network issues
// Set worker to a local file served from `public/pdfjs/pdf.worker.min.js` if available.
// Copy `node_modules/pdfjs-dist/build/pdf.worker.min.js` -> `public/pdfjs/pdf.worker.min.js`
try {
  const base = (import.meta.env && import.meta.env.BASE_URL) ? import.meta.env.BASE_URL : '/';
  pdfjs.GlobalWorkerOptions.workerSrc = `${base}pdfjs/pdf.worker.min.mjs`;
  console.debug('[PdfViewer] set pdf.worker to', pdfjs.GlobalWorkerOptions.workerSrc);
} catch (e) {
  try {
    pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
  } catch (__) {}
}

const PdfViewer = ({ url }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [fileData, setFileData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!url) return;
    const ac = new AbortController();
    setLoading(true);
    setError(null);
    setFileData(null);

    console.debug('[PdfViewer] fetching PDF url=', url);
    fetch(url, { signal: ac.signal })
      .then((res) => {
        console.debug('[PdfViewer] fetch status', res.status);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.arrayBuffer();
      })
      .then((buffer) => setFileData(new Uint8Array(buffer)))
      .catch((err) => {
        if (err.name === 'AbortError') return;
        console.error('Error fetching PDF:', err);
        setError(err.message || 'Error al cargar PDF');
      })
      .finally(() => setLoading(false));

    return () => ac.abort();
  }, [url]);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setPageNumber(1);
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex items-center justify-between gap-2 p-2 border-b border-white/10 bg-black/5">
        <div className="flex items-center gap-2">
          <button onClick={() => setPageNumber((p) => Math.max(1, p - 1))} className="px-2 py-1 bg-white/5 rounded">Prev</button>
          <span className="text-sm">{pageNumber} / {numPages || '-'}</span>
          <button onClick={() => setPageNumber((p) => Math.min(numPages || p, p + 1))} className="px-2 py-1 bg-white/5 rounded">Next</button>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setScale((s) => Math.max(0.5, s - 0.25))} className="px-2 py-1 bg-white/5 rounded">-</button>
          <span className="text-sm">{Math.round(scale * 100)}%</span>
          <button onClick={() => setScale((s) => Math.min(3, s + 0.25))} className="px-2 py-1 bg-white/5 rounded">+</button>
          <a href={url} target="_blank" rel="noreferrer" className="px-2 py-1 bg-white/5 rounded text-sm">Abrir en nueva pestaña</a>
          <a href={url} download className="px-2 py-1 bg-white/5 rounded text-sm">Descargar</a>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 bg-gray-900/50 flex items-center justify-center">
        {loading && <div className="text-gray-300">Cargando documento...</div>}
        {error && <div className="text-red-400">Error: {error}</div>}
        {!loading && !error && fileData && (
          <Document file={{ data: fileData }} onLoadSuccess={onDocumentLoadSuccess} onLoadError={(e) => { console.error('[PdfViewer] react-pdf load error', e); setError(String(e)); }} className="flex justify-center">
            <Page pageNumber={pageNumber} scale={scale} />
          </Document>
        )}
      </div>
    </div>
  );
};

export default PdfViewer;
