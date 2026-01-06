'use client'

import React, { useEffect, useState } from 'react'

type SiteSettings = {
	adminLogo?: {
		url?: string
		sizes?: Record<string, { url?: string }>
	}
	primaryColor?: string
}

const fetchSiteSettings = async (): Promise<SiteSettings | null> => {
	try {
		const res = await fetch('/api/globals/site-settings', { cache: 'no-store' })
		if (!res.ok) return null
		const data = await res.json()
		return (data?.siteSettings ?? data) as SiteSettings
	} catch (err) {
		console.warn('Unable to load site-settings', err)
		return null
	}
}

export const InmemsoLogo: React.FC = () => {
	const [logoUrl, setLogoUrl] = useState<string | undefined>()
	const [primaryColor, setPrimaryColor] = useState<string | undefined>()

	useEffect(() => {
		fetchSiteSettings().then((settings) => {
			if (!settings) return
			const media = settings.adminLogo as any
			const bestUrl = media?.url || media?.sizes?.thumbnail?.url || media?.sizes?.card?.url
			if (bestUrl) setLogoUrl(bestUrl)
			if (settings.primaryColor) setPrimaryColor(settings.primaryColor)
		})
	}, [])

	const color = primaryColor || '#0f172a'

	if (logoUrl) {
		return (
			<img
				src={logoUrl}
				alt="Inmemso admin logo"
				style={{ height: 28, objectFit: 'contain' }}
			/>
		)
	}

	return (
		<div className="inmemso-logo" aria-label="Inmemso admin logo" style={{ color }}>
			<span className="inmemso-logo__text" style={{ fontWeight: 800 }}>
				INMEMSO.
			</span>
		</div>
	)
}

export default InmemsoLogo
