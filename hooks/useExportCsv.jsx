import axios from "axios";
import ExcelJS from "exceljs";
import FileSaver from "file-saver";

const useExportCsv = () => {
  const handleExportXLSX = async (data) => {
    try {
      const uniqueCategories = [
        ...new Set(data?.flatMap((value) => value.categories)),
      ];
      const header = ["Item", ...uniqueCategories];
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Sheet1");
      worksheet.addRow(header);
      const imageSizes = [];

      for (const value of data) {
        const row = [
          value.image_url
            ? { text: "Image", hyperlink: value.image_url }
            : "No Image",
        ];
        uniqueCategories.forEach((category) => {
          row.push(value.categories.includes(category) ? 1 : 0);
        });
        worksheet.addRow(row);

        if (value.image_url) {
          const imageBuffer = await axios.get(value.image_url, {
            responseType: "arraybuffer",
          });
          const imageId = workbook.addImage({
            buffer: imageBuffer.data,
            extension: "jpeg",
          });

          const image = worksheet.addImage(imageId, {
            tl: { col: 0, row: worksheet.rowCount - 1 },
            ext: { width: 50, height: 50 },
          });
          imageSizes.push({ width: 50, height: 50 });
        } else {
          imageSizes.push({ width: 50, height: 50 });
        }
      }
      const colWidths = [
        { wch: 60 },
        { wch: 45 },
        ...uniqueCategories.map(() => ({ wch: 22 })),
      ];
      const rowHeights = [
        { hpt: 60 },
        ...imageSizes.map((size) => ({ hpt: size.height })),
      ];
      worksheet.columns = colWidths;
      worksheet["cols"] = colWidths;
      worksheet["rows"] = rowHeights;

      const xlsxBuffer = await workbook.xlsx.writeBuffer();
      const xlsxBlob = new Blob([xlsxBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      FileSaver.saveAs(xlsxBlob, "categories.xlsx");
    } catch (e) {
      console.error("Error exporting XLSX:", e);
    }
  };

  return { handleExportXLSX };
};

export default useExportCsv;
