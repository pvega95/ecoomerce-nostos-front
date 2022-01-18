export enum StatusOrder {
    Creado = 'CREADO',
    Cancelado = 'ANULADO'
  }
export enum Status {
  pendiente,
  pagado ,
  anulado
}
export interface StatusModel {
  label: string;
  textColor: string;
  bgColor: string;
}
export function getStatusStyle(status: Status){
  switch (status) {
    case Status.pendiente: {
      return {_id: 1, label: 'PENDIENTE', textColor: 'white', bgColor: 'red'}
    }
    case Status.pagado: {
      return {_id: 2, label: 'PAGADO', textColor: 'white', bgColor: 'green'}
    }
    case Status.anulado: {
      return {_id: 3, label: 'ANULADO', textColor: 'white', bgColor: 'gray'}
    }
  }
}