import { NextRequest, NextResponse } from 'next/server';
import { handleApiError, ErrorLogger } from '@/lib/error-handler';

export async function POST(request: NextRequest) {
  try {
    const errorData = await request.json();
    
    // Validate the error data
    if (!errorData.message) {
      return NextResponse.json(
        { error: 'Error message is required' },
        { status: 400 }
      );
    }

    // Log the client error
    ErrorLogger.log({
      name: 'ClientError',
      message: errorData.message,
      stack: errorData.stack,
      statusCode: 500,
      code: 'CLIENT_ERROR',
      context: {
        url: errorData.url,
        userAgent: errorData.userAgent,
        timestamp: errorData.timestamp,
        additionalContext: errorData.additionalContext,
        source: 'client',
      },
      isOperational: true,
    });

    // In a production environment, you might want to:
    // 1. Store errors in a database
    // 2. Send to external logging service (Sentry, LogRocket, etc.)
    // 3. Send alerts for critical errors
    // 4. Rate limit error reporting

    return NextResponse.json(
      { success: true, message: 'Error reported successfully' },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}

// Optional: GET endpoint to retrieve error statistics (for admin dashboard)
export async function GET() {
  try {
    // This would typically require authentication and admin permissions

    // Mock response - in a real app, you'd query your error storage
    const mockErrors = {
      total: 0,
      errors: [],
      summary: {
        last24Hours: 0,
        mostCommon: [],
        trends: {},
      },
    };

    return NextResponse.json(mockErrors);
  } catch (error) {
    return handleApiError(error);
  }
}