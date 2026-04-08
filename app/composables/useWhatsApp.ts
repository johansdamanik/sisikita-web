/**
 * Composable for WhatsApp redirect with template message.
 */
export const useWhatsApp = () => {
  const generateMessage = (
    userName: string,
    userPostTitle: string,
    userSide: string,
    userSize: string,
    partnerName: string,
    partnerPostTitle: string,
    partnerSide: string,
    partnerSize: string,
  ) => {
    const sideLabel = (side: string) => (side === 'LEFT' ? 'Kiri' : 'Kanan')

    return `Halo ${partnerName}! 👋

Saya ${userName} dari SisiKita.
Saya tertarik dengan post Anda:
- ${partnerPostTitle}
Sisi: ${sideLabel(partnerSide)} | Ukuran: ${partnerSize}

Post saya:
- ${userPostTitle}
Sisi: ${sideLabel(userSide)} | Ukuran: ${userSize}

Apakah kita bisa berkoordinasi?`
  }

  const openWhatsApp = (phone: string, message: string) => {
    // Clean phone number: remove spaces, dashes, and leading 0
    let cleanPhone = phone.replace(/[\s-]/g, '')
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '62' + cleanPhone.substring(1)
    }
    if (!cleanPhone.startsWith('+') && !cleanPhone.startsWith('62')) {
      cleanPhone = '62' + cleanPhone
    }

    const encodedMessage = encodeURIComponent(message)
    const url = `https://wa.me/${cleanPhone}?text=${encodedMessage}`

    window.open(url, '_blank')
  }

  return { generateMessage, openWhatsApp }
}
