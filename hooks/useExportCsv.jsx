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
      const headerRow = worksheet.addRow(header);
      headerRow.font = { bold: true };
      headerRow.alignment = { horizontal: "center" };

      worksheet.getColumn(1).width = 120 / 7.5;
      for (const value of data) {
        const row = [
          value.image_url
            ? { text: value.image_url, hyperlink: value.image_url }
            : "No Image",
        ];
        uniqueCategories.forEach((category) => {
          row.push(value.categories.includes(category) ? 1 : 0);
        });
        const currentRow = worksheet.addRow(row);

        if (value.image_url) {
          const imageBuffer = await axios.get(value.image_url, {
            responseType: "arraybuffer",
          });
          const imageId = workbook.addImage({
            buffer: imageBuffer.data,
            extension: "jpeg",
          });

          worksheet.addImage(imageId, {
            tl: { col: 0, row: worksheet.rowCount - 1 },
            ext: { width: 100, height: 100 },
          });

          currentRow.height = 120 / 1.33;
        } else {
          currentRow.height = 120 / 1.33;
        }
      }

      const xlsxBuffer = await workbook.xlsx.writeBuffer();
      const xlsxBlob = new Blob([xlsxBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      FileSaver.saveAs(xlsxBlob, "categories.xlsx");
    } catch (e) {
      console.error("Error exporting XLSX:", e);
    }
  };

  const handleExportXLSXNoImage = async (data) => {
    try {
      const uniqueCategories = [
        ...new Set(data?.flatMap((value) => value.categories)),
      ];
      const header = ["Item", ...uniqueCategories];
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Sheet1");
      const headerRow = worksheet.addRow(header);
      headerRow.font = { bold: true };
      headerRow.alignment = { horizontal: "center" };

      worksheet.getColumn(1).width = 120 / 7.5;
      for (const value of data) {
        const row = [
          value.image_url
            ? { text: value.image_url, hyperlink: value.image_url }
            : "No Image",
        ];
        uniqueCategories.forEach((category) => {
          row.push(value.categories.includes(category) ? 1 : 0);
        });
        const currentRow = worksheet.addRow(row);

        if (value.image_url) {
          const imageBuffer = await axios.get(value.image_url, {
            responseType: "arraybuffer",
          });
          const imageId = workbook.addImage({
            buffer: imageBuffer.data,
            extension: "jpeg",
          });

          worksheet.addImage(imageId, {
            tl: { col: 0, row: worksheet.rowCount - 1 },
            ext: { width: 100, height: 100 },
          });

          currentRow.height = 120 / 1.33;
        } else {
          currentRow.height = 120 / 1.33;
        }
      }

      const xlsxBuffer = await workbook.xlsx.writeBuffer();
      const xlsxBlob = new Blob([xlsxBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      FileSaver.saveAs(xlsxBlob, "categories.xlsx");
    } catch (e) {
      console.error("Error exporting XLSX:", e);
    }
  };

  return { handleExportXLSX, handleExportXLSXNoImage };
};

export default useExportCsv;
