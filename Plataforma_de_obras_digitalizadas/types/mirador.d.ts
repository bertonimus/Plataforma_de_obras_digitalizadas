declare module 'mirador' {
  export interface MiradorConfig {
    id: string
    manifests?: { [key: string]: any }
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
    store: any
    actions: any
  }

  export function viewer(config: MiradorConfig): MiradorViewer | null

  const Mirador: {
    viewer: (config: MiradorConfig) => MiradorViewer | null
  }

  export default Mirador
}