export interface NodeInfo {
  id: string;
  xpos: number;
  ypos: number;
  content: string;
  soundRecordable: boolean;
  hasVariable: boolean;
  isNew?: boolean;
}

export interface RelationInfo {
  id: string;
  sourceId: string;
  targetId: string;
  intentId: string;
  isNew?: boolean;
}
