import { readFile } from 'fs/promises'
import { ImageResponse } from 'next/og'
import type { NextRequest } from 'next/server'
import { join } from 'path'

export const runtime = 'nodejs'

// Inline the logo once at module load to avoid fetch/network issues in OG rendering.
const logoPromise = readFile(
  join(process.cwd(), 'public', 'btq_wordmark_light.png'),
).then((buf) => `data:image/png;base64,${buf.toString('base64')}`)

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const title = searchParams.get('title') ?? 'Better Transport Queensland'
  const date = searchParams.get('date') ?? ''
  const category = searchParams.get('category') ?? 'Media Release'
  const image = searchParams.get('image') ?? ''

  const logoSrc = await logoPromise
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          position: 'relative',
          fontFamily: 'sans-serif',
          overflow: 'hidden',
        }}
      >
        {/* Background: hero image or gradient fallback */}
        {image ? (
          <img
            src={image}
            width={1200}
            height={630}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        ) : null}

        {/* Dark overlay for readability */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: image
              ? 'linear-gradient(to top, rgba(30, 27, 75, 0.95) 0%, rgba(30, 27, 75, 0.7) 50%, rgba(30, 27, 75, 0.4) 100%)'
              : 'linear-gradient(135deg, #312e81, #3730a3, #581c87)',
          }}
        />

        {/* Content layer */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '60px 64px',
          }}
        >
          {/* Decorative circles (only when no image) */}
          {!image && (
            <div
              style={{
                position: 'absolute',
                top: '-80px',
                right: '-80px',
                width: '320px',
                height: '320px',
                borderRadius: '50%',
                background: 'rgba(244, 114, 182, 0.15)',
                filter: 'blur(60px)',
              }}
            />
          )}
          {!image && (
            <div
              style={{
                position: 'absolute',
                bottom: '-100px',
                left: '-60px',
                width: '400px',
                height: '400px',
                borderRadius: '50%',
                background: 'rgba(129, 140, 248, 0.2)',
                filter: 'blur(80px)',
              }}
            />
          )}

          {/* Top: category badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                background: 'rgba(255,255,255,0.15)',
                borderRadius: '9999px',
                padding: '8px 20px',
                fontSize: '20px',
                color: 'rgba(255,255,255,0.9)',
                fontWeight: 600,
                backdropFilter: 'blur(8px)',
              }}
            >
              {category}
            </div>
            {date && (
              <span
                style={{
                  fontSize: '18px',
                  color: 'rgba(199, 210, 254, 0.7)',
                }}
              >
                {date}
              </span>
            )}
          </div>

          {/* Middle: title */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              flex: 1,
              justifyContent: 'flex-end',
              paddingBottom: '16px',
            }}
          >
            <h1
              style={{
                fontSize: title.length > 80 ? '42px' : '52px',
                fontWeight: 800,
                color: 'white',
                lineHeight: 1.15,
                letterSpacing: '-0.02em',
                margin: 0,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                textShadow: image ? '0 2px 20px rgba(0,0,0,0.4)' : 'none',
              }}
            >
              {title}
            </h1>
          </div>

          {/* Bottom: branding */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <img
              src={logoSrc}
              width={270}
              height={82}
              style={{ height: '40px', width: 'auto' }}
            />
            <span
              style={{
                fontSize: '16px',
                color: 'rgba(199, 210, 254, 0.7)',
              }}
            >
              bettertransportqueensland.org
            </span>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  )
}
