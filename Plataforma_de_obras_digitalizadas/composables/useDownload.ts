export interface DownloadOptions {
  format: 'pdf' | 'zip' | 'images'
  quality: 'high' | 'medium' | 'low'
  pages?: {
    start: number
    end: number
  }
}

export interface DownloadProgress {
  current: number
  total: number
  percentage: number
  status: 'preparing' | 'downloading' | 'processing' | 'complete' | 'error'
  message: string
}

export const useDownload = () => {
  const downloadProgress = ref<DownloadProgress | null>(null)
  const isDownloading = ref(false)

  // Função para baixar um livro completo
  const downloadBook = async (bookKey: string, bookTitle: string, options: DownloadOptions = { format: 'pdf', quality: 'high' }) => {
    try {
      isDownloading.value = true
      downloadProgress.value = {
        current: 0,
        total: 100,
        percentage: 0,
        status: 'preparing',
        message: 'Preparando download...'
      }

      // Buscar dados do livro para obter informações das páginas
      const bookData = await $fetch(`https://nexus.fw.dev.ucframework.pt/v1/digitalis/collections/joanina/items/${bookKey}`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })

      const totalPages = bookData.stats?.pages || 1
      const baseUrl = bookData.cover?.url?.replace("{KEY}", bookData.cover.key).replace("{FILENAME}", "") || ''

      downloadProgress.value = {
        current: 0,
        total: totalPages,
        percentage: 5,
        status: 'downloading',
        message: `Baixando ${totalPages} páginas...`
      }

      if (options.format === 'pdf') {
        await downloadAsPDF(bookKey, bookTitle, totalPages, baseUrl, options)
      } else if (options.format === 'zip') {
        await downloadAsZip(bookKey, bookTitle, totalPages, baseUrl, options)
      } else {
        await downloadAsImages(bookKey, bookTitle, totalPages, baseUrl, options)
      }

      downloadProgress.value = {
        current: totalPages,
        total: totalPages,
        percentage: 100,
        status: 'complete',
        message: 'Download concluído!'
      }

      // Limpar progresso após 3 segundos
      setTimeout(() => {
        downloadProgress.value = null
        isDownloading.value = false
      }, 3000)

    } catch (error) {
      console.error('Erro no download:', error)
      downloadProgress.value = {
        current: 0,
        total: 100,
        percentage: 0,
        status: 'error',
        message: 'Erro no download. Tente novamente.'
      }
      
      setTimeout(() => {
        downloadProgress.value = null
        isDownloading.value = false
      }, 5000)
    }
  }

  // Download como PDF usando jsPDF
  const downloadAsPDF = async (bookKey: string, bookTitle: string, totalPages: number, baseUrl: string, options: DownloadOptions) => {
    // Importar jsPDF dinamicamente
    const { jsPDF } = await import('jspdf')
    const pdf = new jsPDF('p', 'mm', 'a4')

    const startPage = options.pages?.start || 1
    const endPage = options.pages?.end || totalPages
    const pagesToDownload = endPage - startPage + 1

    for (let i = startPage; i <= endPage; i++) {
      try {
        const pageNumber = i.toString().padStart(4, '0')
        const imageUrl = `${baseUrl}page_${pageNumber}.jpg`
        
        // Baixar imagem
        const response = await fetch(imageUrl)
        if (!response.ok) continue

        const blob = await response.blob()
        const imageDataUrl = await blobToDataURL(blob)

        // Adicionar página ao PDF
        if (i > startPage) {
          pdf.addPage()
        }

        // Calcular dimensões para manter proporção
        const pageWidth = pdf.internal.pageSize.getWidth()
        const pageHeight = pdf.internal.pageSize.getHeight()
        
        pdf.addImage(imageDataUrl, 'JPEG', 0, 0, pageWidth, pageHeight)

        // Atualizar progresso
        const currentProgress = i - startPage + 1
        downloadProgress.value = {
          current: currentProgress,
          total: pagesToDownload,
          percentage: Math.round((currentProgress / pagesToDownload) * 90) + 5,
          status: 'downloading',
          message: `Processando página ${i} de ${endPage}...`
        }

      } catch (error) {
        console.error(`Erro ao processar página ${i}:`, error)
      }
    }

    // Salvar PDF
    downloadProgress.value!.status = 'processing'
    downloadProgress.value!.message = 'Finalizando PDF...'
    
    const fileName = `${sanitizeFileName(bookTitle)}.pdf`
    pdf.save(fileName)
  }

  // Download como ZIP com imagens
  const downloadAsZip = async (bookKey: string, bookTitle: string, totalPages: number, baseUrl: string, options: DownloadOptions) => {
    // Importar JSZip dinamicamente
    const JSZip = (await import('jszip')).default
    const zip = new JSZip()

    const startPage = options.pages?.start || 1
    const endPage = options.pages?.end || totalPages
    const pagesToDownload = endPage - startPage + 1

    for (let i = startPage; i <= endPage; i++) {
      try {
        const pageNumber = i.toString().padStart(4, '0')
        const imageUrl = `${baseUrl}page_${pageNumber}.jpg`
        
        const response = await fetch(imageUrl)
        if (!response.ok) continue

        const blob = await response.blob()
        zip.file(`pagina_${pageNumber}.jpg`, blob)

        // Atualizar progresso
        const currentProgress = i - startPage + 1
        downloadProgress.value = {
          current: currentProgress,
          total: pagesToDownload,
          percentage: Math.round((currentProgress / pagesToDownload) * 80) + 5,
          status: 'downloading',
          message: `Baixando página ${i} de ${endPage}...`
        }

      } catch (error) {
        console.error(`Erro ao baixar página ${i}:`, error)
      }
    }

    // Gerar e baixar ZIP
    downloadProgress.value!.status = 'processing'
    downloadProgress.value!.message = 'Compactando arquivos...'
    
    const zipBlob = await zip.generateAsync({ type: 'blob' })
    const fileName = `${sanitizeFileName(bookTitle)}.zip`
    downloadBlob(zipBlob, fileName)
  }

  // Download de imagens individuais
  const downloadAsImages = async (bookKey: string, bookTitle: string, totalPages: number, baseUrl: string, options: DownloadOptions) => {
    const startPage = options.pages?.start || 1
    const endPage = options.pages?.end || totalPages

    for (let i = startPage; i <= endPage; i++) {
      try {
        const pageNumber = i.toString().padStart(4, '0')
        const imageUrl = `${baseUrl}page_${pageNumber}.jpg`
        
        const response = await fetch(imageUrl)
        if (!response.ok) continue

        const blob = await response.blob()
        const fileName = `${sanitizeFileName(bookTitle)}_pagina_${pageNumber}.jpg`
        downloadBlob(blob, fileName)

        // Atualizar progresso
        const currentProgress = i - startPage + 1
        const totalPages = endPage - startPage + 1
        downloadProgress.value = {
          current: currentProgress,
          total: totalPages,
          percentage: Math.round((currentProgress / totalPages) * 90) + 5,
          status: 'downloading',
          message: `Baixando página ${i} de ${endPage}...`
        }

        // Pequeno delay entre downloads para não sobrecarregar
        await new Promise(resolve => setTimeout(resolve, 100))

      } catch (error) {
        console.error(`Erro ao baixar página ${i}:`, error)
      }
    }
  }

  // Função para baixar uma página específica
  const downloadPage = async (bookKey: string, bookTitle: string, pageNumber: number) => {
    try {
      isDownloading.value = true
      downloadProgress.value = {
        current: 0,
        total: 1,
        percentage: 0,
        status: 'preparing',
        message: 'Preparando download da página...'
      }

      // Buscar dados do livro
      const bookData = await $fetch(`https://nexus.fw.dev.ucframework.pt/v1/digitalis/collections/joanina/items/${bookKey}`)
      const baseUrl = bookData.cover?.url?.replace("{KEY}", bookData.cover.key).replace("{FILENAME}", "") || ''
      
      const pageNumberStr = pageNumber.toString().padStart(4, '0')
      const imageUrl = `${baseUrl}page_${pageNumberStr}.jpg`
      
      downloadProgress.value = {
        current: 0,
        total: 1,
        percentage: 50,
        status: 'downloading',
        message: `Baixando página ${pageNumber}...`
      }

      const response = await fetch(imageUrl)
      if (!response.ok) {
        throw new Error('Página não encontrada')
      }

      const blob = await response.blob()
      const fileName = `${sanitizeFileName(bookTitle)}_pagina_${pageNumberStr}.jpg`
      downloadBlob(blob, fileName)

      downloadProgress.value = {
        current: 1,
        total: 1,
        percentage: 100,
        status: 'complete',
        message: 'Download concluído!'
      }

      setTimeout(() => {
        downloadProgress.value = null
        isDownloading.value = false
      }, 2000)

    } catch (error) {
      console.error('Erro no download da página:', error)
      downloadProgress.value = {
        current: 0,
        total: 1,
        percentage: 0,
        status: 'error',
        message: 'Erro no download. Tente novamente.'
      }
      
      setTimeout(() => {
        downloadProgress.value = null
        isDownloading.value = false
      }, 3000)
    }
  }

  // Funções auxiliares
  const blobToDataURL = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  }

  const downloadBlob = (blob: Blob, fileName: string) => {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = fileName
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const sanitizeFileName = (fileName: string): string => {
    return fileName
      .replace(/[^a-zA-Z0-9\s\-_]/g, '')
      .replace(/\s+/g, '_')
      .substring(0, 100)
  }

  return {
    downloadBook,
    downloadPage,
    downloadProgress: readonly(downloadProgress),
    isDownloading: readonly(isDownloading)
  }
}