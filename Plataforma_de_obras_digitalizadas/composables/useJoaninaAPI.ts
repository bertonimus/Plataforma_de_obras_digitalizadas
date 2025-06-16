export interface JoaninaItem {
    id: string
    title: string
    author?: string
    date?: string
    description?: string
    thumbnail?: string
    images?: string[]
    metadata?: {
      pages?: number
      format?: string
      language?: string
      publisher?: string
      subject?: string[]
    }
  }
  
  export interface JoaninaResponse {
    items: JoaninaItem[]
    total: number
    page: number
    limit: number
  }
  
  export const useJoaninaAPI = () => {
    const baseURL = 'https://nexus.fw.dev.ucframework.pt/v1/digitalis/collections/joanina'
  
    const fetchItems = async (page: number = 1, limit: number = 20): Promise<JoaninaResponse> => {
      try {
        const response = await $fetch<JoaninaResponse>(`${baseURL}/items`, {
          params: {
            page,
            limit
          }
        })
        return response
      } catch (error) {
        console.error('Erro ao carregar itens da Biblioteca Joanina:', error)
        throw error
      }
    }
  
    const fetchItem = async (id: string): Promise<JoaninaItem> => {
      try {
        const response = await $fetch<JoaninaItem>(`${baseURL}/items/${id}`)
        return response
      } catch (error) {
        console.error(`Erro ao carregar item ${id}:`, error)
        throw error
      }
    }
  
    const searchItems = async (query: string, page: number = 1, limit: number = 20): Promise<JoaninaResponse> => {
      try {
        const response = await $fetch<JoaninaResponse>(`${baseURL}/items`, {
          params: {
            q: query,
            page,
            limit
          }
        })
        return response
      } catch (error) {
        console.error('Erro na pesquisa:', error)
        throw error
      }
    }
  
    return {
      fetchItems,
      fetchItem,
      searchItems
    }
  }