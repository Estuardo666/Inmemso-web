'use client'

import React, { useEffect, useState } from 'react'

type SiteSettings = {
	adminLogoLight?: { url?: string; sizes?: Record<string, { url?: string }> }
	adminLogoDark?: { url?: string; sizes?: Record<string, { url?: string }> }
	primaryColor?: string
}

const fetchSiteSettings = async (): Promise<SiteSettings | null> => {
	try {
		const res = await fetch('/api/globals/site-settings?depth=2', { cache: 'no-store' })
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
	const [isDark, setIsDark] = useState<boolean>(false)
	const [primaryColor, setPrimaryColor] = useState<string | undefined>()

	useEffect(() => {
		// Detect system/theme preference
		const mq = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)')
		if (mq) {
			setIsDark(mq.matches)
			const onChange = (e: MediaQueryListEvent) => setIsDark(e.matches)
			mq.addEventListener?.('change', onChange)
			return () => mq.removeEventListener?.('change', onChange)
		}
	}, [])

	useEffect(() => {
		fetchSiteSettings().then((settings) => {
			if (!settings) return
			const light = settings.adminLogoLight as any
			const dark = settings.adminLogoDark as any
			const pick = (m: any) => m?.url || m?.sizes?.thumbnail?.url || m?.sizes?.card?.url
			const chosen = isDark ? pick(dark) : pick(light)
			const fallback = isDark ? pick(light) : pick(dark)
			const bestUrl = chosen || fallback
			if (bestUrl) setLogoUrl(bestUrl)
			if (settings.primaryColor) setPrimaryColor(settings.primaryColor)
		})
	}, [isDark])

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
