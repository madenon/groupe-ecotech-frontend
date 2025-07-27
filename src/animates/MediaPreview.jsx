import { useState } from "react";
import { Loader } from "lucide-react";
import { Document, Page } from "react-pdf";

const MediaPreview = ({
  mediaType,
  mediaPreview,
  numPages,
  onDocumentLoadSuccess,
  onRemove,
}) => {
  const [pdfLoadFailed, setPdfLoadFailed] = useState(false);
  const [isPdfLoading, setIsPdfLoading] = useState(false);

  if (!mediaPreview) return null;

  return (
    <div className="mt-4">
      {mediaType === "image" && (
        <img src={mediaPreview} alt="Aperçu" className="rounded-lg w-full" />
      )}

      {mediaType === "video" && (
        <video src={mediaPreview} controls className="rounded-lg w-full" />
      )}

      {mediaType === "pdf" && (
        <div className="w-full h-[400px] overflow-auto relative border rounded">
          {isPdfLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/70 z-10">
              <Loader className="size-6 animate-spin text-blue-600" />
              <span className="ml-2 text-sm text-gray-600">Chargement du PDF...</span>
            </div>
          )}

          {!pdfLoadFailed ? (
            <Document
              file={mediaPreview}
              onLoadStart={() => setIsPdfLoading(true)}
              onLoadSuccess={(doc) => {
                setIsPdfLoading(false);
                onDocumentLoadSuccess(doc);
              }}
              onLoadError={(err) => {
                console.error("Erreur PDF :", err);
                setPdfLoadFailed(true);
                setIsPdfLoading(false);
              }}
            >
              {numPages &&
                Array.from({ length: numPages }, (_, i) => (
                  <Page
                    key={i}
                    pageNumber={i + 1}
                    scale={1.7}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                  />
                ))}
            </Document>
          ) : (
            <iframe
              src={mediaPreview}
              className="w-full h-[400px] border rounded"
              title="Aperçu PDF (fallback)"
            />
          )}
        </div>
      )}

      <button
        className="text-sm text-red-500 mt-2 underline"
        onClick={onRemove}
      >
        Supprimer le fichier
      </button>
    </div>
  );
};

export default MediaPreview;
