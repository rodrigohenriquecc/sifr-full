import { Router } from 'express';
import PdfPrinter from 'pdfmake';

const r = Router();

r.get('/period', async (req, res) => {
  const db = (req as any).db;
  const { de, ate } = req.query as any;
  const clauses: string[] = [];
  const params: any[] = [];
  if (de){ params.push(de); clauses.push(`data >= $${params.length}`); }
  if (ate){ params.push(ate); clauses.push(`data <= $${params.length}`); }
  const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
  const sql = `SELECT * FROM occurrences ${where} ORDER BY data ASC LIMIT 5000`;
  const { rows } = await db.query(sql, params);

  const body = [
    [{text:'Tipo',bold:true},{text:'Rodovia',bold:true},{text:'KM',bold:true},{text:'Data',bold:true},{text:'Obs',bold:true}]
  ];
  for(const o of rows){
    body.push([o.tipo||'', o.rodovia||'', String(o.km||''), o.data? new Date(o.data).toISOString().slice(0,10):'', (o.obs||'').slice(0,120)]);
  }
  const docDef:any = {
    info: { title: 'Relatório de Fiscalização' },
    content: [
      { text: 'Relatório de Fiscalização', style: 'h1' },
      { text: `Período: ${de||'—'} a ${ate||'—'}`, margin:[0,0,0,10] },
      { table: { headerRows: 1, widths: ['auto','*','auto','auto','*'], body } }
    ],
    styles: { h1: { fontSize: 18, bold: true, margin:[0,0,0,8] } },
    defaultStyle: { fontSize: 10 }
  };

  const printer = new PdfPrinter({});
  const pdfDoc = (printer as any).createPdfKitDocument(docDef);
  const chunks: Buffer[] = [];
  pdfDoc.on('data', (c: Buffer) => chunks.push(c));
  pdfDoc.on('end', () => {
    const buf = Buffer.concat(chunks);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename="relatorio.pdf"');
    res.send(buf);
  });
  pdfDoc.end();
});

export default r;
