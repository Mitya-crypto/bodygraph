import { NextRequest, NextResponse } from 'next/server'
import { executeN8NWorkflow, getN8NExecutionResult } from '@/lib/n8nApi'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { workflowId, inputData, scenario } = body

    console.log('🚀 Executing n8n workflow...', {
      workflowId,
      scenario,
      hasInputData: !!inputData,
    })

    if (!workflowId) {
      return NextResponse.json(
        { error: 'Workflow ID is required' },
        { status: 400 }
      )
    }

    // Выполняем workflow
    const execution = await executeN8NWorkflow(workflowId, inputData)
    
    if (!execution) {
      return NextResponse.json(
        { error: 'Failed to execute workflow' },
        { status: 500 }
      )
    }

    console.log('✅ n8n workflow executed:', {
      executionId: execution.id,
      status: execution.status,
      workflowId: execution.workflowId,
    })

    // Если выполнение завершено, получаем результат
    let result = null
    if (execution.finished) {
      result = execution.resultData
    }

    return NextResponse.json({
      success: true,
      execution: {
        id: execution.id,
        status: execution.status,
        finished: execution.finished,
        startedAt: execution.startedAt,
        stoppedAt: execution.stoppedAt,
        workflowId: execution.workflowId,
        resultData: result,
      },
      message: 'Workflow executed successfully',
    })
  } catch (error) {
    console.error('❌ Error executing n8n workflow:', error)
    return NextResponse.json(
      { 
        error: 'Failed to execute workflow',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const executionId = searchParams.get('executionId')

    if (!executionId) {
      return NextResponse.json(
        { error: 'Execution ID is required' },
        { status: 400 }
      )
    }

    console.log('🔍 Getting n8n execution result...', { executionId })

    const execution = await getN8NExecutionResult(executionId)
    
    if (!execution) {
      return NextResponse.json(
        { error: 'Execution not found' },
        { status: 404 }
      )
    }

    console.log('✅ n8n execution retrieved:', {
      id: execution.id,
      status: execution.status,
      finished: execution.finished,
    })

    return NextResponse.json({
      success: true,
      execution: {
        id: execution.id,
        status: execution.status,
        finished: execution.finished,
        startedAt: execution.startedAt,
        stoppedAt: execution.stoppedAt,
        workflowId: execution.workflowId,
        resultData: execution.resultData,
      },
    })
  } catch (error) {
    console.error('❌ Error getting n8n execution:', error)
    return NextResponse.json(
      { 
        error: 'Failed to get execution result',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}



