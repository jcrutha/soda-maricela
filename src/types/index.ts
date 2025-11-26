export interface AdminMenuItem {
  Categoria: string;
  Costo_Unitario_CRC: string;
  Nombre: string;
  Descripcion: string;
  Precio_CRC: string;
  Margen_CRC: string;
}

export interface PublicMenuItem {
  category: string;
  name: string;
  description: string;
  priceCRC: number;
}
