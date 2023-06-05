import { describe, expect, it } from 'vitest'
import { hasLengthGreaterOrEqual } from "../utils";

describe('hasLengthGreaterOrEqual tests', () => {
    it('should be true if length is greater or equal than 6', () => {
        const greaterOrEqualThan6 = hasLengthGreaterOrEqual(6)

        const str = "780883"

        expect(greaterOrEqualThan6(str)).toBeTruthy()
    })

    it('should be false if length is less than 6', () => {
        const greaterOrEqualThan6 = hasLengthGreaterOrEqual(6)

        const str = "78088"

        expect(greaterOrEqualThan6(str)).toBeFalsy()
    })
})
