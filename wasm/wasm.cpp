#include <stdint.h>
#include <stdlib.h>
#include <stdio.h>

extern "C"
{
    void sort(
        float *viewProj, uint32_t vertexCount,
        float *fBuffer, uint8_t *uBuffer,
        uint32_t *depthBuffer, uint32_t *depthIndex,
        uint32_t *starts)
    {
        int32_t minDepth = 0x7fffffff;
        int32_t maxDepth = 0x80000000;
        for (uint32_t i = 0; i < vertexCount; i++)
        {
            float f0 = viewProj[2] * fBuffer[8 * i + 0];
            float f1 = viewProj[6] * fBuffer[8 * i + 1];
            float f2 = viewProj[10] * fBuffer[8 * i + 2];
            int32_t depth = (f0 + f1 + f2) * 4096;
            depthBuffer[i] = depth;
            if (depth > maxDepth)
            {
                maxDepth = depth;
            }
            if (depth < minDepth)
            {
                minDepth = depth;
            }
        }

        const uint32_t depthRange = 256 * 256;
        const float depthInv = (float)depthRange / (maxDepth - minDepth);
        uint32_t *counts = (uint32_t *)calloc(depthRange, sizeof(uint32_t));
        for (uint32_t i = 0; i < vertexCount; i++)
        {
            depthBuffer[i] = (depthBuffer[i] - minDepth) * depthInv;
            counts[depthBuffer[i]]++;
        }

        starts[0] = 0;
        for (uint32_t i = 1; i < depthRange; i++)
        {
            starts[i] = starts[i - 1] + counts[i - 1];
        }

        for (uint32_t i = 0; i < vertexCount; i++)
        {
            depthIndex[starts[depthBuffer[i]]++] = i;
        }

        free(counts);
    }
}
