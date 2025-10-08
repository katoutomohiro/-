import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import PhotoUpload from '@/components/photo-upload'

describe('PhotoUpload', () => {
  it('renders button and shows count', () => {
    render(<PhotoUpload photos={[]} onChange={() => {}} />)
    expect(screen.getByRole('button', { name: /写真を追加/i })).toBeTruthy()
  })
})
