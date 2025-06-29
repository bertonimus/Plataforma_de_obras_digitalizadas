declare module 'mirador' {
  export interface IIIFManifest {
    '@context'?: string | string[]
    '@id'?: string
    id?: string
    '@type'?: string
    type?: string
    label?: string | { [key: string]: string[] }
    description?: string | { [key: string]: string[] }
    metadata?: Array<{
      label: string | { [key: string]: string[] }
      value: string | { [key: string]: string[] }
    }>
    sequences?: any[]
    items?: any[]
    [key: string]: any
  }

  export interface MiradorConfig {
    id: string
    manifests?: { [key: string]: IIIFManifest }
    windows?: Array<{
      manifestId: string
      canvasIndex?: number
    }>
    workspaceControlPanel?: {
      enabled: boolean
    }
    window?: {
      allowClose?: boolean
      allowMaximize?: boolean
      defaultSideBarPanel?: string
      sideBarOpenByDefault?: boolean
      panels?: {
        info?: boolean
        attribution?: boolean
        canvas?: boolean
        annotations?: boolean
        search?: boolean
      }
    }
    workspace?: {
      showZoomControls?: boolean
      type?: string
    }
    thumbnailNavigation?: {
      defaultPosition?: string
    }
  }

  export interface MiradorViewer {
    store?: any
    actions?: any
    [key: string]: any
  }

  export function viewer(config: MiradorConfig): MiradorViewer

  const Mirador: {
    viewer: (config: MiradorConfig) => MiradorViewer
  }

  export default Mirador
}