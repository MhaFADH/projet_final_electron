import { dialog, BrowserWindow } from 'electron';
import { writeFile } from 'node:fs/promises';
import type { Exporter, ExportData, ExportResult } from './exporter';

const htmlToPdf = async (html: string): Promise<Buffer> => {
  const win = new BrowserWindow({ show: false });
  try {
    await win.loadURL(
      `data:text/html;charset=utf-8,${encodeURIComponent(html)}`,
    );
    return await win.webContents.printToPDF({ printBackground: true });
  } finally {
    win.destroy();
  }
};

export const exportToFile = async (
  exporter: Exporter,
  data: ExportData,
): Promise<ExportResult> => {
  const content = exporter.render(data);
  const result = await dialog.showSaveDialog({
    defaultPath: `${data.title}.${exporter.extension}`,
    filters: [{ name: exporter.label, extensions: [exporter.extension] }],
  });
  if (result.canceled || !result.filePath) {
    return { saved: false };
  }
  if (exporter.format === 'pdf') {
    await writeFile(result.filePath, await htmlToPdf(content));
  } else {
    await writeFile(result.filePath, content, 'utf8');
  }
  return { saved: true, path: result.filePath };
};
