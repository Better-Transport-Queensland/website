import { Container } from '@/components/container'
import { Link } from '@/components/link'

function SocialIconBluesky(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 568 501"
      fill="currentColor"
      {...props}
    >
      <path d="M123.121 33.6637C188.241 82.5526 258.281 181.681 284 234.873C309.719 181.681 379.759 82.5526 444.879 33.6637C491.866 -1.61183 568 -28.9064 568 57.9464C568 75.2916 558.055 203.659 552.222 224.501C531.947 296.954 458.067 315.434 392.347 304.249C507.222 323.8 536.444 388.56 473.333 453.32C353.473 576.312 301.061 422.461 287.631 383.039C285.169 375.812 284.017 372.431 284 375.306C283.983 372.431 282.831 375.812 280.369 383.039C266.939 422.461 214.527 576.312 94.6667 453.32C31.5556 388.56 60.7778 323.8 175.653 304.249C109.933 315.434 36.0535 296.954 15.7778 224.501C9.94525 203.659 0 75.2916 0 57.9464C0 -28.9064 76.1345 -1.61183 123.121 33.6637Z" />
    </svg>
  )
}

function SocialIconFacebook(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16 8.05C16 3.603 12.418 0 8 0S0 3.604 0 8.05c0 4.016 2.926 7.346 6.75 7.95v-5.624H4.718V8.05H6.75V6.276c0-2.017 1.194-3.131 3.022-3.131.875 0 1.79.157 1.79.157v1.98h-1.008c-.994 0-1.304.62-1.304 1.257v1.51h2.219l-.355 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.95z"
      />
    </svg>
  )
}

function SocialIconLinkedIn(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" {...props}>
      <path d="M14.82 0H1.18A1.169 1.169 0 000 1.154v13.694A1.168 1.168 0 001.18 16h13.64A1.17 1.17 0 0016 14.845V1.15A1.171 1.171 0 0014.82 0zM4.744 13.64H2.369V5.996h2.375v7.644zm-1.18-8.684a1.377 1.377 0 11.52-.106 1.377 1.377 0 01-.527.103l.007.003zm10.075 8.683h-2.375V9.921c0-.885-.015-2.025-1.234-2.025-1.218 0-1.425.966-1.425 1.968v3.775H6.233V5.997H8.51v1.05h.032c.317-.601 1.09-1.235 2.246-1.235 2.405-.005 2.851 1.578 2.851 3.63v4.197z" />
    </svg>
  )
}

function SocialIconInstagram(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      viewBox="0 0 512 512"
      {...props}
    >
      <path d="M256,49.471c67.266,0,75.233.257,101.8,1.469,24.562,1.121,37.9,5.224,46.778,8.674a78.052,78.052,0,0,1,28.966,18.845,78.052,78.052,0,0,1,18.845,28.966c3.45,8.877,7.554,22.216,8.674,46.778,1.212,26.565,1.469,34.532,1.469,101.8s-0.257,75.233-1.469,101.8c-1.121,24.562-5.225,37.9-8.674,46.778a83.427,83.427,0,0,1-47.811,47.811c-8.877,3.45-22.216,7.554-46.778,8.674-26.56,1.212-34.527,1.469-101.8,1.469s-75.237-.257-101.8-1.469c-24.562-1.121-37.9-5.225-46.778-8.674a78.051,78.051,0,0,1-28.966-18.845,78.053,78.053,0,0,1-18.845-28.966c-3.45-8.877-7.554-22.216-8.674-46.778-1.212-26.564-1.469-34.532-1.469-101.8s0.257-75.233,1.469-101.8c1.121-24.562,5.224-37.9,8.674-46.778A78.052,78.052,0,0,1,78.458,78.458a78.053,78.053,0,0,1,28.966-18.845c8.877-3.45,22.216-7.554,46.778-8.674,26.565-1.212,34.532-1.469,101.8-1.469m0-45.391c-68.418,0-77,.29-103.866,1.516-26.815,1.224-45.127,5.482-61.151,11.71a123.488,123.488,0,0,0-44.62,29.057A123.488,123.488,0,0,0,17.3,90.982C11.077,107.007,6.819,125.319,5.6,152.134,4.369,179,4.079,187.582,4.079,256S4.369,333,5.6,359.866c1.224,26.815,5.482,45.127,11.71,61.151a123.489,123.489,0,0,0,29.057,44.62,123.486,123.486,0,0,0,44.62,29.057c16.025,6.228,34.337,10.486,61.151,11.71,26.87,1.226,35.449,1.516,103.866,1.516s77-.29,103.866-1.516c26.815-1.224,45.127-5.482,61.151-11.71a128.817,128.817,0,0,0,73.677-73.677c6.228-16.025,10.486-34.337,11.71-61.151,1.226-26.87,1.516-35.449,1.516-103.866s-0.29-77-1.516-103.866c-1.224-26.815-5.482-45.127-11.71-61.151a123.486,123.486,0,0,0-29.057-44.62A123.487,123.487,0,0,0,421.018,17.3C404.993,11.077,386.681,6.819,359.866,5.6,333,4.369,324.418,4.079,256,4.079h0Z" />
      <path d="M256,126.635A129.365,129.365,0,1,0,385.365,256,129.365,129.365,0,0,0,256,126.635Zm0,213.338A83.973,83.973,0,1,1,339.974,256,83.974,83.974,0,0,1,256,339.973Z" />
      <circle cx="390.476" cy="121.524" r="30.23" />
    </svg>
  )
}

function SocialLinks({ filled }: { filled?: true }) {
  return (
    <>
      <Link
        href="https://www.facebook.com/profile.php?id=61571105606896"
        target="_blank"
        aria-label="Visit us on Facebook"
        className={`${filled ? 'text-white data-[hover]:text-white/80' : 'text-black data-[hover]:text-black/80'}`}
      >
        <SocialIconFacebook className="size-4" />
      </Link>
      <Link
        href="https://www.instagram.com/bettertransportqueensland"
        target="_blank"
        aria-label="Visit us on Instagram"
        className={`${filled ? 'text-white data-[hover]:text-white/80' : 'text-black data-[hover]:text-black/80'}`}
      >
        <SocialIconInstagram className="size-4" />
      </Link>
      <Link
        href="https://bsky.app/profile/bettertransportqueensland.org"
        target="_blank"
        aria-label="Visit us on Bluesky"
        className={`${filled ? 'text-white data-[hover]:text-white/80' : 'text-black data-[hover]:text-black/80'}`}
      >
        <SocialIconBluesky className="size-4" />
      </Link>
      <Link
        href="https://www.linkedin.com/company/better-transport-queensland"
        target="_blank"
        aria-label="Visit us on LinkedIn"
        className={`${filled ? 'text-white data-[hover]:text-white/80' : 'text-black data-[hover]:text-black/80'}`}
      >
        <SocialIconLinkedIn className="size-4" />
      </Link>
    </>
  )
}

function Copyright() {
  return (
    <div className="">
      &copy; {new Date().getFullYear()} Better Transport Queensland Inc.
    </div>
  )
}

export function Footer({ filled }: { filled?: true }) {
  return (
    <footer className="p-2">
      <div className={`rounded-4xl ${filled ? 'bg-indigo-800' : ''}`}>
        <Container>
          <div
            className={`flex justify-between py-8 ${filled ? 'text-white' : 'border-t-2 border-black/5 text-black'}`}
          >
            <div>
              <div className="py-3">
                <Copyright />
              </div>
            </div>
            <div className="flex">
              <div className="flex items-center gap-8 py-3">
                <SocialLinks filled={filled} />
              </div>
            </div>
          </div>
        </Container>
        <div className="z-0" />
      </div>
    </footer>
  )
}
